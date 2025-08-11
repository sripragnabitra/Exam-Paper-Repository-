import generateToken from "../utils/generateToken.js";

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

export const logoutUser = (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out" });
  });
};
