import express from "express";
import {
  getPendingPapers,
  approvePaper,
  rejectPaper,
  getUsers,
  updateUserCredits,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/papers/pending", protect, adminOnly, getPendingPapers);
router.post("/papers/:id/approve", protect, adminOnly, approvePaper);
router.post("/papers/:id/reject", protect, adminOnly, rejectPaper);

router.get("/users", protect, adminOnly, getUsers);
router.post("/users/:userId/credits", protect, adminOnly, updateUserCredits);

export default router;
