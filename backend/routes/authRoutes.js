import express from "express";
import passport from "passport";
import { googleLoginSuccess, logoutUser } from "../controllers/authController.js";

const router = express.Router();

// Google OAuth login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/success`);
  }
);

// Success endpoint for frontend
router.get("/success", googleLoginSuccess);

// Logout
router.get("/logout", logoutUser);

export default router;
