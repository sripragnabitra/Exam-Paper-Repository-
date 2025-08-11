// backend/routes/searchRoutes.js
import express from "express";
import { searchPapers } from "../controllers/searchController.js";

const router = express.Router();

// GET /api/search?courseCode=...&keywords=...
router.get("/", searchPapers);

export default router;
