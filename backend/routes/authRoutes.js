import express from "express";
import passport from "passport";
import { googleLoginSuccess, getMe, logoutUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import generateToken from "../utils/generateToken.js";

const router = express.Router();

// Google OAuth login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback - redirect to frontend with token in query param
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed` }),
  (req, res) => {
    const token = generateToken(req.user._id);
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  }
);

// Get current logged-in user (called by frontend on load if token exists)
router.get("/me", protect, getMe);

// Legacy success endpoint (kept for compatibility)
router.get("/success", googleLoginSuccess);

// Logout
router.get("/logout", logoutUser);

export default router;
