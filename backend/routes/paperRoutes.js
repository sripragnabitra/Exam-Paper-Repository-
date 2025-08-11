import express from "express";
import multer from "multer";
import { uploadPaper, getPapers } from "../controllers/paperController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", protect, upload.single("file"), uploadPaper);
router.get("/", getPapers);

export default router;
