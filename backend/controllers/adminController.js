import Paper from "../models/Paper.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

export const getPendingPapers = async (req, res) => {
  try {
    const papers = await Paper.find({ status: "pending" })
      .populate("uploader", "fullName email")
      .sort({ createdAt: -1 });
    res.json(papers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const approvePaper = async (req, res) => {
  try {
    const { id } = req.params;
    const paper = await Paper.findById(id);
    if (!paper) return res.status(404).json({ message: "Paper not found" });

    paper.status = "approved";
    paper.creditsAwarded = 10;
    await paper.save();

    // Award credits to uploader
    if (paper.uploader) {
      const uploader = await User.findById(paper.uploader);
      if (uploader) {
        uploader.credits += paper.creditsAwarded;
        await uploader.save();

        // Create in-app notification
        await Notification.create({
          user: uploader._id,
          title: "Paper Approved!",
          body: `Your paper "${paper.title || paper.courseCode}" was approved. You earned ${paper.creditsAwarded} credits.`,
        });
      }
    }

    res.json({ message: "Paper approved", paper });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const rejectPaper = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const paper = await Paper.findById(id);
    if (!paper) return res.status(404).json({ message: "Paper not found" });

    paper.status = "rejected";
    await paper.save();

    // Notify uploader
    if (paper.uploader) {
      await Notification.create({
        user: paper.uploader,
        title: "Paper Rejected",
        body: `Your paper "${paper.title || paper.courseCode}" was rejected.${reason ? ` Reason: ${reason}` : ""}`,
      });
    }

    res.json({ message: "Paper rejected" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-googleId").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserCredits = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body;
    if (typeof amount !== "number") return res.status(400).json({ message: "amount must be a number" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.credits = Math.max(0, user.credits + amount);
    await user.save();
    res.json({ message: "Credits updated", credits: user.credits });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
