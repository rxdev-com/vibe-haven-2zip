import { Router } from "express";
import mongoose from "mongoose";
import User from "../models/User.js";

const router = Router();

router.get("/suppliers", async (req, res, next) => {
  try {
    const { search, category, limit = 50 } = req.query;
    const filter = { role: "supplier" };
    if (category) filter.categories = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { businessName: { $regex: search, $options: "i" } },
      ];
    }
    const suppliers = await User.find(filter)
      .select("-emailVerificationCode")
      .sort({ rating: -1 })
      .limit(Number(limit));
    res.json({ suppliers });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ error: "Invalid user id" });
    const user = await User.findById(req.params.id).select(
      "-emailVerificationCode",
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

export default router;
