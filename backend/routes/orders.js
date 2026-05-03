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
    const filter =
      req.user.role === "vendor"
        ? { vendor: req.user._id }
        : { supplier: req.user._id };

    // Support comma-separated statuses e.g. ?status=confirmed,processing,shipped
    if (status) {
      const statuses = status.split(",").map((s) => s.trim()).filter(Boolean);
      filter.status = statuses.length === 1 ? statuses[0] : { $in: statuses };
    }

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

// Map frontend payment method names to backend enum values
function mapPaymentMethod(method) {
  const map = {
    cod: "cash",
    cash: "cash",
    upi: "upi",
    card: "card",
    wallet: "wallet",
    bank_transfer: "cash",
    net_banking: "cash",
  };
  return map[method] || "cash";
}

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
  specialInstructions: z.string().optional(),
  paymentMethod: z.string().optional(),
  urgency: z.string().optional(),
  deliveryPreference: z.string().optional(),
  phone: z.string().optional(),
});

router.post("/", requireAuth, requireRole("vendor"), async (req, res, next) => {
  try {
    const data = createOrderSchema.parse(req.body);

    const ids = data.items.map((i) => i.materialId);
    const materials = await Material.find({ _id: { $in: ids } });
    if (materials.length !== ids.length) {
      return res.status(400).json({ error: "One or more materials not found" });
    }

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

    // Get supplier to use their delivery fee settings
    const supplier = await User.findById(supplierId);
    const supplierDeliveryFee = supplier?.deliveryFee ?? 50;
    const freeDeliveryThreshold = supplier?.freeDeliveryAbove ?? 1000;
    const deliveryFee = subtotal >= freeDeliveryThreshold ? 0 : supplierDeliveryFee;
    const totalAmount = subtotal + deliveryFee;

    const paymentMethod = mapPaymentMethod(data.paymentMethod || "cash");
    const deliveryInstructions = data.deliveryInstructions || data.specialInstructions || "";

    const order = await Order.create({
      vendor: req.user._id,
      supplier: supplierId,
      items,
      subtotal,
      deliveryFee,
      totalAmount,
      deliveryAddress: data.deliveryAddress,
      deliveryInstructions,
      paymentMethod,
      urgency: data.urgency || "normal",
      deliveryPreference: data.deliveryPreference || "standard",
      estimatedDelivery: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    });

    // Decrement stock
    await Promise.all(
      items.map((item) =>
        Material.updateOne(
          { _id: item.material },
          { $inc: { stock: -item.quantity, totalSold: item.quantity } },
        ),
      ),
    );

    // Update supplier order count
    if (supplier) {
      await User.updateOne({ _id: supplierId }, { $inc: { totalOrders: 1 } });
    }

    // Notify the supplier
    try {
      await Notification.create({
        user: supplierId,
        title: "New Order Received",
        message: `New order from ${req.user.businessName || req.user.name}`,
        type: "order",
        relatedId: order._id,
        relatedModel: "Order",
      });
    } catch (_) {}

    const populated = await Order.findById(order._id)
      .populate("vendor", "name businessName phone address")
      .populate("supplier", "name businessName phone address");

    res.status(201).json({ order: populated });
  } catch (err) {
    next(err);
  }
});

router.put("/:id/status", requireAuth, requireRole("supplier"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ error: "Invalid order id" });

    const { status, note } = z
      .object({
        status: z.enum(ORDER_STATUSES),
        note: z.string().optional(),
        supplierNotes: z.string().optional(),
      })
      .parse(req.body);

    const order = await Order.findOne({
      _id: req.params.id,
      supplier: req.user._id,
    });
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status;
    order.statusHistory.push({
      status,
      note: note || req.body.supplierNotes || `Status changed to ${status}`,
      changedBy: req.user._id,
    });
    if (status === "delivered") {
      order.deliveredAt = new Date();
      // Update supplier revenue
      await User.updateOne(
        { _id: req.user._id },
        { $inc: { totalRevenue: order.totalAmount } },
      );
    }
    await order.save();

    // Notify vendor
    try {
      await Notification.create({
        user: order.vendor,
        title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: `Your order #${order.orderNumber} has been ${status}`,
        type: "order",
        relatedId: order._id,
        relatedModel: "Order",
      });
    } catch (_) {}

    const populated = await Order.findById(order._id)
      .populate("vendor", "name businessName phone address")
      .populate("supplier", "name businessName phone address");

    res.json({ order: populated });
  } catch (err) {
    next(err);
  }
});

router.put("/:id/cancel", requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ error: "Invalid order id" });

    const { cancellationReason } = z
      .object({ cancellationReason: z.string().optional() })
      .parse(req.body);

    const filter =
      req.user.role === "vendor"
        ? { _id: req.params.id, vendor: req.user._id }
        : { _id: req.params.id, supplier: req.user._id };

    const order = await Order.findOne(filter);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.status === "delivered" || order.status === "cancelled") {
      return res.status(400).json({ error: "Cannot cancel this order" });
    }

    order.status = "cancelled";
    order.cancellationReason = cancellationReason || "Cancelled";
    order.cancelledBy = req.user.role;
    order.statusHistory.push({
      status: "cancelled",
      note: cancellationReason || "Cancelled",
      changedBy: req.user._id,
    });
    await order.save();

    // Restore stock for cancelled orders
    try {
      await Promise.all(
        order.items.map((item) =>
          Material.updateOne(
            { _id: item.material },
            { $inc: { stock: item.quantity, totalSold: -item.quantity } },
          ),
        ),
      );
    } catch (_) {}

    res.json({ order });
  } catch (err) {
    next(err);
  }
});

router.put("/:id/rate", requireAuth, requireRole("vendor"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ error: "Invalid order id" });

    const ratingData = z
      .object({
        rating: z.number().min(1).max(5),
        review: z.string().optional(),
        title: z.string().optional(),
      })
      .parse(req.body);

    const order = await Order.findOne({
      _id: req.params.id,
      vendor: req.user._id,
      status: "delivered",
    });
    if (!order) return res.status(404).json({ error: "Order not found or not delivered" });

    order.rating = ratingData;
    await order.save();

    // Update supplier's average rating
    const ratedOrders = await Order.find({
      supplier: order.supplier,
      "rating.rating": { $exists: true, $ne: null },
    });
    if (ratedOrders.length > 0) {
      const avg =
        ratedOrders.reduce((sum, o) => sum + (o.rating?.rating || 0), 0) /
        ratedOrders.length;
      await User.updateOne(
        { _id: order.supplier },
        { rating: Math.round(avg * 10) / 10, totalRatings: ratedOrders.length },
      );
    }

    res.json({ order });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/stats — supplier stats summary
router.get("/stats/summary", requireAuth, async (req, res, next) => {
  try {
    const filter =
      req.user.role === "vendor"
        ? { vendor: req.user._id }
        : { supplier: req.user._id };

    const [total, pending, confirmed, delivered, revenue] = await Promise.all([
      Order.countDocuments(filter),
      Order.countDocuments({ ...filter, status: "pending" }),
      Order.countDocuments({ ...filter, status: { $in: ["confirmed", "processing", "shipped"] } }),
      Order.countDocuments({ ...filter, status: "delivered" }),
      Order.aggregate([
        { $match: { ...filter, status: "delivered" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
    ]);

    // Monthly revenue for current month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyRevData = await Order.aggregate([
      { $match: { ...filter, status: "delivered", createdAt: { $gte: monthStart } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    res.json({
      total,
      pending,
      active: confirmed,
      delivered,
      totalRevenue: revenue[0]?.total || req.user.totalRevenue || 0,
      monthlyRevenue: monthlyRevData[0]?.total || 0,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
