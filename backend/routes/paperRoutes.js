import express from "express";
import multer from "multer";
import { uploadPaper, getPapers, getPaperById, downloadPaper } from "../controllers/paperController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", getPapers);
router.get("/:id/download", protect, downloadPaper);
router.get("/:id", getPaperById);
router.post("/upload", protect, upload.single("file"), uploadPaper);

export default router;
