import { Router } from "express";
import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(100);
    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      read: false,
    });
    res.json({ notifications, unreadCount });
  } catch (err) {
    next(err);
  }
});

router.put("/read-all", requireAuth, async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { $set: { read: true } },
    );
    res.json({ message: "All marked as read" });
  } catch (err) {
    next(err);
  }
});

router.put("/:id/read", requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ error: "Invalid id" });
    const n = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true },
    );
    if (!n) return res.status(404).json({ error: "Notification not found" });
    res.json({ notification: n });
  } catch (err) {
    next(err);
  }
});

router.delete("/clear", requireAuth, async (req, res, next) => {
  try {
    await Notification.deleteMany({ user: req.user._id });
    res.json({ message: "All cleared" });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ error: "Invalid id" });
    const n = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!n) return res.status(404).json({ error: "Notification not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
