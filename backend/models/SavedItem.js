import mongoose from "mongoose";

const savedItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
      required: true,
    },
  },
  { timestamps: true },
);

savedItemSchema.index({ user: 1, material: 1 }, { unique: true });

export default mongoose.model("SavedItem", savedItemSchema);
