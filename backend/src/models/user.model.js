import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    imageUrl: { type: String, required: true },
    clerkId: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
    },
    canUpload: {
      type: Boolean,
      default: false, // Changed to false to restrict uploads by default
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
