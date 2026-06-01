import generateToken from "../utils/generateToken.js";
import User from "../models/User.js";

export const googleLoginSuccess = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Login failed" });
  }
  const token = generateToken(req.user._id);
  res.json({
    _id: req.user._id,
    fullName: req.user.fullName,
    email: req.user.email,
    isAdmin: req.user.isAdmin,
    credits: req.user.credits,
    token,
  });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-googleId");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      isAdmin: user.isAdmin,
      credits: user.credits,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out" });
  });
};
