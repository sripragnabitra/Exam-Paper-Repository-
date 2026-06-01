import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, default: false },
    credits: { type: Number, default: 0 },
    googleId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
