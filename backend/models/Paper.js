import mongoose from "mongoose";

const paperSchema = new mongoose.Schema(
  {
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    courseCode: String,
    academicYear: String,
    semester: String,
    examType: String,
    fileUrl: String,
    fileHash: String,
    readable: { type: Boolean, default: null },
    status: { type: String, default: "pending" }, // pending, approved, rejected
    creditsAwarded: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Paper", paperSchema);
