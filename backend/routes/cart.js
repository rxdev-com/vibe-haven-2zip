import { Router } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import CartItem from "../models/CartItem.js";
import Material from "../models/Material.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const items = await CartItem.find({ user: req.user._id })
      .populate({
        path: "material",
        populate: { path: "supplier", select: "name businessName" },
      })
      .sort({ createdAt: -1 });

    const filtered = items.filter((i) => i.material);
    const totalItems = filtered.reduce((s, i) => s + i.quantity, 0);
    const totalAmount = filtered.reduce(
      (s, i) => s + i.material.price * i.quantity,
      0,
    );

    res.json({ items: filtered, totalItems, totalAmount });
  } catch (err) {
    next(err);
  }
});

const addSchema = z.object({
  materialId: z.string(),
  quantity: z.number().int().positive().optional(),
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { materialId, quantity = 1 } = addSchema.parse(req.body);
    if (!mongoose.isValidObjectId(materialId))
      return res.status(400).json({ error: "Invalid material id" });
    const material = await Material.findById(materialId);
    if (!material) return res.status(404).json({ error: "Material not found" });

    const existing = await CartItem.findOne({
      user: req.user._id,
      material: materialId,
    });
    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      return res.json({ item: existing });
    }
    const item = await CartItem.create({
      user: req.user._id,
      material: materialId,
      quantity,
    });
    res.status(201).json({ item });
  } catch (err) {
    next(err);
  }
});

router.put("/:materialId", requireAuth, async (req, res, next) => {
  try {
    const { materialId } = req.params;
    const { quantity } = z
      .object({ quantity: z.number().int().min(0) })
      .parse(req.body);

    if (!mongoose.isValidObjectId(materialId))
      return res.status(400).json({ error: "Invalid material id" });

    if (quantity === 0) {
      await CartItem.deleteOne({ user: req.user._id, material: materialId });
      return res.json({ message: "Removed" });
    }

    const item = await CartItem.findOneAndUpdate(
      { user: req.user._id, material: materialId },
      { quantity },
      { new: true, upsert: true },
    );
    res.json({ item });
  } catch (err) {
    next(err);
  }
});

router.delete("/:materialId", requireAuth, async (req, res, next) => {
  try {
    await CartItem.deleteOne({
      user: req.user._id,
      material: req.params.materialId,
    });
    res.json({ message: "Removed" });
  } catch (err) {
    next(err);
  }
});

router.delete("/", requireAuth, async (req, res, next) => {
  try {
    await CartItem.deleteMany({ user: req.user._id });
    res.json({ message: "Cleared" });
  } catch (err) {
    next(err);
  }
});

export default router;
