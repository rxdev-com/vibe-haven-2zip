import { Router } from "express";
import mongoose from "mongoose";
import SavedItem from "../models/SavedItem.js";
import Material from "../models/Material.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const items = await SavedItem.find({ user: req.user._id })
      .populate({
        path: "material",
        populate: { path: "supplier", select: "name businessName" },
      })
      .sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) {
    next(err);
  }
});

router.post("/:materialId", requireAuth, async (req, res, next) => {
  try {
    const { materialId } = req.params;
    if (!mongoose.isValidObjectId(materialId))
      return res.status(400).json({ error: "Invalid material id" });
    const material = await Material.findById(materialId);
    if (!material) return res.status(404).json({ error: "Material not found" });

    try {
      const item = await SavedItem.create({
        user: req.user._id,
        material: materialId,
      });
      return res.status(201).json({ message: "Saved", item });
    } catch (e) {
      if (e.code === 11000)
        return res.status(200).json({ message: "Already saved" });
      throw e;
    }
  } catch (err) {
    next(err);
  }
});

router.delete("/:materialId", requireAuth, async (req, res, next) => {
  try {
    const { materialId } = req.params;
    if (!mongoose.isValidObjectId(materialId))
      return res.status(400).json({ error: "Invalid material id" });
    await SavedItem.deleteOne({
      user: req.user._id,
      material: materialId,
    });
    res.json({ message: "Removed" });
  } catch (err) {
    next(err);
  }
});

export default router;
