import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const pointSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },
  { _id: false },
);

const businessImageSchema = new mongoose.Schema(
  {
    url: { type: String, default: "" },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    tag: { type: String, default: "" },
    isMain: { type: Boolean, default: false },
  },
  { _id: true },
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[\w.+-]+@[\w-]+\.[\w.-]+$/, "Invalid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    phone: { type: String, required: true, trim: true },
    role: { type: String, enum: ["vendor", "supplier"], required: true },
    businessName: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    profileImage: { type: String, default: "" },

    // Vendor-specific
    specialties: { type: [String], default: [] },

    // Supplier-specific
    categories: { type: [String], default: [] },
    deliveryAreas: { type: [String], default: [] },
    businessType: { type: String, default: "" },
    license: { type: String, default: "" },
    acceptingOrders: { type: Boolean, default: true },

    // Supplier legal info
    gstNumber: { type: String, default: "" },
    panNumber: { type: String, default: "" },
    fssaiLicense: { type: String, default: "" },
    establishedYear: { type: String, default: "" },

    // Supplier delivery config
    deliveryFee: { type: Number, default: 50 },
    freeDeliveryAbove: { type: Number, default: 1000 },
    minOrderAmount: { type: Number, default: 500 },
    maxDeliveryDistance: { type: Number, default: 25 },
    estimatedDeliveryTime: { type: String, default: "2-4 hours" },

    // Business images (supplier gallery)
    businessImages: { type: [businessImageSchema], default: [] },

    location: { type: pointSchema, default: () => ({}) },

    isVerified: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    emailVerificationCode: { type: String, default: null, select: false },
    emailVerificationSentAt: { type: Date, default: null },

    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
  },
  { timestamps: true },
);

userSchema.index({ location: "2dsphere" });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.emailVerificationCode;
  return obj;
};

export default mongoose.model("User", userSchema);
