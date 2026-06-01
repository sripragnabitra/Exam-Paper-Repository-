import Paper from "../models/Paper.js";
import User from "../models/User.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-googleId");
    const papers = await Paper.find({ uploader: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        credits: user.credits,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      },
      papers,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
