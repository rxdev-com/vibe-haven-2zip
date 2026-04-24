import { Router } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import Order, { ORDER_STATUSES } from "../models/Order.js";
import Material from "../models/Material.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = req.user.role === "vendor"
      ? { vendor: req.user._id }
      : { supplier: req.user._id };
    if (status) filter.status = status;

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("vendor", "name businessName phone address")
        .populate("supplier", "name businessName phone address")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(filter),
    ]);

    res.json({
      orders,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ error: "Invalid order id" });

    const order = await Order.findById(req.params.id)
      .populate("vendor", "name businessName phone address email")
      .populate("supplier", "name businessName phone address email")
      .populate("items.material", "name image unit");

    if (!order) return res.status(404).json({ error: "Order not found" });

    const isOwner =
      order.vendor._id.toString() === req.user._id.toString() ||
      order.supplier._id.toString() === req.user._id.toString();
    if (!isOwner) return res.status(403).json({ error: "Not your order" });

    res.json({ order });
  } catch (err) {
    next(err);
  }
});

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        materialId: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
  deliveryAddress: z.string().min(1),
  deliveryInstructions: z.string().optional(),
  paymentMethod: z.enum(["cash", "card", "upi", "wallet"]).optional(),
});

router.post("/", requireAuth, requireRole("vendor"), async (req, res, next) => {
  try {
    const data = createOrderSchema.parse(req.body);

    // Load all materials
    const ids = data.items.map((i) => i.materialId);
    const materials = await Material.find({ _id: { $in: ids } });
    if (materials.length !== ids.length) {
      return res.status(400).json({ error: "One or more materials not found" });
    }

    // All items must belong to a single supplier (one order = one supplier)
    const supplierId = materials[0].supplier.toString();
    if (!materials.every((m) => m.supplier.toString() === supplierId)) {
      return res
        .status(400)
        .json({ error: "All items must be from the same supplier" });
    }

    let subtotal = 0;
    const items = data.items.map((req) => {
      const m = materials.find((x) => x._id.toString() === req.materialId);
      if (m.stock < req.quantity) {
        const err = new Error(`Insufficient stock for ${m.name}`);
        err.status = 400;
        throw err;
      }
      const total = m.price * req.quantity;
      subtotal += total;
      return {
        material: m._id,
        name: m.name,
        image: m.image,
        price: m.price,
        quantity: req.quantity,
        unit: m.unit,
        total,
      };
    });

    const deliveryFee = subtotal >= 500 ? 0 : 30;
    const totalAmount = subtotal + deliveryFee;

    const order = await Order.create({
      vendor: req.user._id,
      supplier: supplierId,
      items,
      subtotal,
      deliveryFee,
      totalAmount,
      deliveryAddress: data.deliveryAddress,
      deliveryInstructions: data.deliveryInstructions || "",
      paymentMethod: data.paymentMethod || "cash",
      estimatedDelivery: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // +2 days
    });

    // Decrement stock and increment totalSold
    await Promise.all(
      items.map((item) =>
        Material.updateOne(
          { _id: item.material },
          { $inc: { stock: -item.quantity, totalSold: item.quantity } },
        ),
      ),
    );

    // Notify the supplier
    await Notification.create({
      user: supplierId,
      title: "New Order Received",
      message: `${req.user.businessName || req.user.name} placed a new order #${order.orderNumber}`,
      type: "order",
      icon: "📦",
      actionUrl: `/supplier/orders/${order._id}`,
    });

    res.status(201).json({ message: "Order placed", order });
  } catch (err) {
    next(err);
  }
});

const statusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
  supplierNotes: z.string().optional(),
});

router.put("/:id/status", requireAuth, requireRole("supplier"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ error: "Invalid order id" });

    const { status, supplierNotes } = statusSchema.parse(req.body);

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.supplier.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Not your order" });

    order.status = status;
    if (supplierNotes) order.supplierNotes = supplierNotes;
    if (status === "delivered") order.deliveredAt = new Date();
    order.statusHistory.push({ status, note: supplierNotes || "" });
    await order.save();

    // Notify vendor
    await Notification.create({
      user: order.vendor,
      title: `Order ${status.replace("_", " ")}`,
      message: `Your order #${order.orderNumber} is now ${status.replace("_", " ")}`,
      type: status === "delivered" ? "success" : "order",
      icon: status === "delivered" ? "✅" : "🚚",
      actionUrl: `/vendor/orders/${order._id}`,
    });

    res.json({ message: "Status updated", order });
  } catch (err) {
    next(err);
  }
});

router.put("/:id/cancel", requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ error: "Invalid order id" });
    const reason = (req.body && req.body.cancellationReason) || "";

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    const isOwner =
      order.vendor.toString() === req.user._id.toString() ||
      order.supplier.toString() === req.user._id.toString();
    if (!isOwner) return res.status(403).json({ error: "Not your order" });

    if (["delivered", "cancelled"].includes(order.status)) {
      return res
        .status(400)
        .json({ error: `Cannot cancel an order that is already ${order.status}` });
    }

    order.status = "cancelled";
    order.cancellationReason = reason;
    order.cancelledBy = req.user.role;
    order.statusHistory.push({ status: "cancelled", note: reason });
    await order.save();

    // Restore stock
    await Promise.all(
      order.items.map((item) =>
        Material.updateOne(
          { _id: item.material },
          { $inc: { stock: item.quantity, totalSold: -item.quantity } },
        ),
      ),
    );

    // Notify the other party
    const recipient =
      req.user.role === "vendor" ? order.supplier : order.vendor;
    await Notification.create({
      user: recipient,
      title: "Order Cancelled",
      message: `Order #${order.orderNumber} was cancelled${reason ? `: ${reason}` : ""}`,
      type: "warning",
      icon: "❌",
      actionUrl: `/${req.user.role === "vendor" ? "supplier" : "vendor"}/orders/${order._id}`,
    });

    res.json({ message: "Order cancelled", order });
  } catch (err) {
    next(err);
  }
});

const ratingSchema = z.object({
  overall: z.number().min(1).max(5),
  quality: z.number().min(1).max(5),
  delivery: z.number().min(1).max(5),
  service: z.number().min(1).max(5),
  comment: z.string().optional(),
});

router.put("/:id/rate", requireAuth, requireRole("vendor"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ error: "Invalid order id" });

    const ratingData = ratingSchema.parse(req.body);

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.vendor.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Not your order" });
    if (order.status !== "delivered")
      return res.status(400).json({ error: "Can only rate delivered orders" });
    if (order.rating)
      return res.status(400).json({ error: "Order already rated" });

    order.rating = { ...ratingData, createdAt: new Date() };
    await order.save();

    // Update supplier aggregate rating
    const supplier = await User.findById(order.supplier);
    if (supplier) {
      const newTotal = supplier.totalRatings + 1;
      supplier.rating =
        (supplier.rating * supplier.totalRatings + ratingData.overall) / newTotal;
      supplier.totalRatings = newTotal;
      await supplier.save();
    }

    // Update each material's aggregate rating
    await Promise.all(
      order.items.map(async (item) => {
        const m = await Material.findById(item.material);
        if (!m) return;
        const newTotal = m.totalRatings + 1;
        m.rating =
          (m.rating * m.totalRatings + ratingData.quality) / newTotal;
        m.totalRatings = newTotal;
        await m.save();
      }),
    );

    res.json({ message: "Rating submitted", order });
  } catch (err) {
    next(err);
  }
});

export default router;
