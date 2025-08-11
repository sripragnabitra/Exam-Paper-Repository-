// backend/worker/processPaper.js
import "dotenv/config";
import path from "path";
import fs from "fs";
import axios from "axios";
import IORedis from "ioredis";
import { Worker } from "bullmq";
import Tesseract from "tesseract.js";
import connectDB from "../config/db.js";
import Paper from "../models/Paper.js";
import Question from "../models/Question.js";

(async () => {
  // connect to Mongo
  await connectDB();

  const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379");

  const worker = new Worker(
    "paper-processing",
    async (job) => {
      const { paperId } = job.data;
      const paper = await Paper.findById(paperId);
      if (!paper) throw new Error("Paper not found");

      // download the file to tmp
      const url = paper.fileUrl;
      const tmpDir = path.join(process.cwd(), "tmp");
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
      const extension = path.extname(url.split("?")[0]) || ".pdf";
      const tmpPath = path.join(tmpDir, `${paperId}${extension}`);

      const resp = await axios.get(url, { responseType: "arraybuffer" });
      fs.writeFileSync(tmpPath, resp.data);

      // NOTE: Tesseract works best on images. For PDFs, you may need to convert each page to an image (e.g., using `pdf-poppler`, `pdf2pic`, or ImageMagick`)
      // For MVP: handle uploads that are images (jpg/png) or single-page PDFs that Tesseract can process.
      console.log("Starting OCR for", tmpPath);

      const { data } = await Tesseract.recognize(tmpPath, "eng", { logger: (m) => console.log(m) });
      const text = data?.text || "";

      // simple segmentation heuristics:
      const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      const questions = [];
      let current = null;
      let qIdx = 0;
      for (const line of lines) {
        // starts with 1., 2) Q1: etc.
        if (/^\d+\s*[\.\)\-:]|^Q\d+[:\.\)]/i.test(line)) {
          if (current) questions.push(current);
          qIdx++;
          current = { text: line, questionIndex: qIdx };
        } else if (current) {
          current.text += " " + line;
        } else {
          // ignore lines before first recognized Q
        }
      }
      if (current) questions.push(current);

      // persist extracted questions
      await Question.deleteMany({ paper: paper._id });
      for (const q of questions) {
        await Question.create({ paper: paper._id, text: q.text, questionIndex: q.questionIndex });
      }

      // update paper
      paper.readable = questions.length > 0;
      paper.status = "ready_for_review";
      await paper.save();

      // cleanup
      try { fs.unlinkSync(tmpPath); } catch (e) {}

      return { extracted: questions.length };
    },
    { connection: {
      host: "127.0.0.1",
      port: 6379,
      maxRetriesPerRequest: null,
    } }
  );

  worker.on("completed", (job) => console.log("Job completed", job.id));
  worker.on("failed", (job, err) => console.error("Job failed", job.id, err));
  console.log("OCR worker started and listening to paper-processing queue");
})();
