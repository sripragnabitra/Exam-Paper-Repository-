// backend/controllers/paperController.js
import Paper from "../models/Paper.js";
import cloudinary from "../config/cloudinary.js";
import crypto from "crypto";
import fs from "fs";
import { paperQueue } from "../config/queue.js";

export const uploadPaper = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Calculate file hash
    const fileHash = crypto.createHash("md5").update(fs.readFileSync(req.file.path)).digest("hex");

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
      title: req.body.title,
      courseCode: req.body.courseCode,
      academicYear: req.body.academicYear,
      semester: req.body.semester,
      examType: req.body.examType,
      fileUrl: result.secure_url,
      fileHash,
      status: "pending",
    });

    // ENQUEUE background job for OCR & segmentation (batch processing)
    await paperQueue.add("process-paper", { paperId: paper._id.toString() });

    res.status(201).json(paper);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPapers = async (req, res) => {
  try {
    const papers = await Paper.find().sort({ createdAt: -1 });
    res.status(200).json(papers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

