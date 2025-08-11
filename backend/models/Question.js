import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    paper: { type: mongoose.Schema.Types.ObjectId, ref: "Paper" },
    text: String,
    pageNumber: Number,
    questionIndex: Number,
    topic: String,
  },
  { timestamps: true }
);

// Add a text index to support keyword search on questions
questionSchema.index({ text: "text" });

export default mongoose.model("Question", questionSchema);
