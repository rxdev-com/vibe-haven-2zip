import { Router } from "express";
import { z } from "zod";
import User from "../models/User.js";
import { requireAuth, signToken } from "../middleware/auth.js";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(5),
  role: z.enum(["vendor", "supplier"]),
  businessName: z.string().min(1),
  address: z.string().min(1),
  description: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  deliveryAreas: z.array(z.string()).optional(),
  businessType: z.string().optional(),
  license: z.string().optional(),
  location: z
    .object({ coordinates: z.tuple([z.number(), z.number()]) })
    .optional(),
});

router.post("/register", async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await User.findOne({ email: data.email.toLowerCase() });
    if (existing) {
      return res
        .status(409)
        .json({ error: "An account with this email already exists" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      ...data,
      emailVerificationCode: code,
      emailVerificationSentAt: new Date(),
    });

    const token = signToken(user._id);

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: user.toPublicJSON(),
      devVerificationCode: code,
    });
  } catch (err) {
    next(err);
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  role: z.enum(["vendor", "supplier"]).optional(),
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password, role } = loginSchema.parse(req.body);

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (role && user.role !== role) {
      return res
        .status(403)
        .json({ error: `This account is registered as ${user.role}, not ${role}` });
    }

    const token = signToken(user._id);
    res.json({
      message: "Logged in successfully",
      token,
      user: user.toPublicJSON(),
    });
  } catch (err) {
    next(err);
  }
});

router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: req.user.toPublicJSON() });
});

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  businessName: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  profileImage: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  deliveryAreas: z.array(z.string()).optional(),
  businessType: z.string().optional(),
  license: z.string().optional(),
  acceptingOrders: z.boolean().optional(),
  // Legal info
  gstNumber: z.string().optional(),
  panNumber: z.string().optional(),
  fssaiLicense: z.string().optional(),
  establishedYear: z.string().optional(),
  // Delivery config
  deliveryFee: z.number().optional(),
  freeDeliveryAbove: z.number().optional(),
  minOrderAmount: z.number().optional(),
  maxDeliveryDistance: z.number().optional(),
  estimatedDeliveryTime: z.string().optional(),
  // Business images
  businessImages: z.array(z.object({
    url: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    tag: z.string().optional(),
    isMain: z.boolean().optional(),
  })).optional(),
  location: z
    .object({ coordinates: z.tuple([z.number(), z.number()]) })
    .optional(),
});

router.put("/profile", requireAuth, async (req, res, next) => {
  try {
    const updates = updateProfileSchema.parse(req.body);
    Object.assign(req.user, updates);
    await req.user.save();
    res.json({
      message: "Profile updated",
      user: req.user.toPublicJSON(),
    });
  } catch (err) {
    next(err);
  }
});

router.post("/resend-verification", requireAuth, async (req, res, next) => {
  try {
    if (req.user.emailVerified) {
      return res.json({ message: "Email already verified" });
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await User.findById(req.user._id).select("+emailVerificationCode");
    user.emailVerificationCode = code;
    user.emailVerificationSentAt = new Date();
    await user.save();
    res.json({
      message: "Verification email sent",
      devVerificationCode: code,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/verify-email", requireAuth, async (req, res, next) => {
  try {
    const { code } = z.object({ code: z.string().length(6) }).parse(req.body);
    const user = await User.findById(req.user._id).select("+emailVerificationCode");
    if (!user.emailVerificationCode || user.emailVerificationCode !== code) {
      return res.status(400).json({ error: "Invalid verification code" });
    }
    user.emailVerified = true;
    user.emailVerificationCode = null;
    await user.save();
    res.json({ message: "Email verified", user: user.toPublicJSON() });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", requireAuth, (req, res) => {
  res.json({ message: "Logged out" });
});

export default router;
