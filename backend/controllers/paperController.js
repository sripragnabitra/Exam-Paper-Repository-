// backend/controllers/paperController.js
import Paper from "../models/Paper.js";
import Question from "../models/Question.js";
import cloudinary from "../config/cloudinary.js";
import crypto from "crypto";
import fs from "fs";

const getQueue = async () => {
  try {
    const mod = await import("../config/queue.js");
    return mod.paperQueue;
  } catch {
    return null;
  }
};

export const uploadPaper = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Calculate file hash
    const fileHash = crypto
      .createHash("md5")
      .update(fs.readFileSync(req.file.path))
      .digest("hex");

    // Check for duplicate
    const duplicate = await Paper.findOne({ fileHash });
    if (duplicate) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Duplicate paper found" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "exam-papers",
      resource_type: "auto",
    });

    fs.unlinkSync(req.file.path); // remove local temp file

    const paper = await Paper.create({
      uploader: req.user._id,
      title: req.body.title || `${req.body.courseCode} - ${req.body.examType || "Exam"}`,
      courseCode: req.body.courseCode,
      academicYear: req.body.academicYear || req.body.year,
      semester: req.body.semester,
      examType: req.body.examType,
      fileUrl: result.secure_url,
      fileHash,
      status: "pending",
    });

    // Enqueue background OCR job (non-blocking)
    const queue = await getQueue();
    if (queue) {
      await queue.add("process-paper", { paperId: paper._id.toString() });
    }

    res.status(201).json(paper);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPapers = async (req, res) => {
  try {
    const papers = await Paper.find({ status: "approved" })
      .populate("uploader", "fullName email")
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json(papers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPaperById = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id)
      .populate("uploader", "fullName email");
    if (!paper) return res.status(404).json({ message: "Paper not found" });

    // Attach questions
    const questions = await Question.find({ paper: paper._id }).sort({ questionIndex: 1 });

    res.json({ ...paper.toObject(), questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const downloadPaper = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) return res.status(404).json({ message: "Paper not found" });
    // Redirect to Cloudinary URL (client downloads directly)
    res.redirect(paper.fileUrl);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
