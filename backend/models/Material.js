import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: "text" },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true }, // kg, litre, piece, etc.
    stock: { type: Number, required: true, min: 0, default: 0 },

    description: { type: String, default: "" },
    image: { type: String, default: "" },
    images: { type: [String], default: [] },
    tags: { type: [String], default: [] },

    minOrderQuantity: { type: Number, default: 1, min: 1 },
    maxOrderQuantity: { type: Number, default: 1000 },

    nutritionalInfo: { type: mongoose.Schema.Types.Mixed, default: {} },
    storageInstructions: { type: String, default: "" },
    shelfLife: { type: String, default: "" },
    origin: { type: String, default: "" },
    certifications: { type: [String], default: [] },

    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    totalSold: { type: Number, default: 0 },
  },
  { timestamps: true },
);

materialSchema.index({ name: "text", description: "text", tags: "text" });

export default mongoose.model("Material", materialSchema);
