import Paper from "../models/Paper.js";
import User from "../models/User.js";

export const getPendingPapers = async (req, res) => {
  const papers = await Paper.find({ status: "pending" }).populate("uploader", "fullName email");
  res.json(papers);
};

export const approvePaper = async (req, res) => {
  const { id } = req.params;
  const paper = await Paper.findById(id);
  if (!paper) return res.status(404).json({ message: "Paper not found" });

  paper.status = "approved";
  paper.creditsAwarded = 10; // Example value
  await paper.save();

  // Award credits to uploader
  const uploader = await User.findById(paper.uploader);
  uploader.credits += paper.creditsAwarded;
  await uploader.save();

  res.json({ message: "Paper approved", paper });
};

export const rejectPaper = async (req, res) => {
  const { id } = req.params;
  const paper = await Paper.findById(id);
  if (!paper) return res.status(404).json({ message: "Paper not found" });

  paper.status = "rejected";
  await paper.save();

  res.json({ message: "Paper rejected" });
};
