import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
      required: true,
    },
    name: { type: String, required: true },
    image: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, required: true },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    note: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
);

const ratingSchema = new mongoose.Schema(
  {
    overall: { type: Number, min: 1, max: 5, required: true },
    quality: { type: Number, min: 1, max: 5, required: true },
    delivery: { type: Number, min: 1, max: 5, required: true },
    service: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "shipped",
  "in_transit",
  "delivered",
  "cancelled",
];

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, index: true },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: { type: [orderItemSchema], required: true, validate: (v) => v.length > 0 },

    subtotal: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "pending",
      index: true,
    },
    statusHistory: { type: [statusHistorySchema], default: [] },

    deliveryAddress: { type: String, required: true },
    deliveryInstructions: { type: String, default: "" },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi", "wallet"],
      default: "cash",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded", "failed"],
      default: "pending",
    },

    supplierNotes: { type: String, default: "" },
    cancellationReason: { type: String, default: "" },
    cancelledBy: {
      type: String,
      enum: ["vendor", "supplier", null],
      default: null,
    },

    rating: { type: ratingSchema, default: null },

    estimatedDelivery: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
  },
  { timestamps: true },
);

orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `JB-${Date.now().toString(36).toUpperCase()}-${Math.floor(
      Math.random() * 1000,
    )
      .toString()
      .padStart(3, "0")}`;
  }
  if (this.isNew) {
    this.statusHistory.push({ status: this.status, note: "Order placed" });
  }
  next();
});

export { ORDER_STATUSES };
export default mongoose.model("Order", orderSchema);
