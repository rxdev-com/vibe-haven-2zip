import { Router } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import Material from "../models/Material.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

function parseListQuery(query, allowInactive = false) {
  const {
    category,
    search,
    minPrice,
    maxPrice,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = 20,
    inStock,
    supplierId,
    isActive,
  } = query;

  const filter = {};

  // Default: only show active. Pass isActive=all to skip filter (supplier's own page).
  if (allowInactive || isActive === "all") {
    // no isActive filter
  } else {
    filter.isActive = true;
  }

  if (category) filter.category = category;
  if (supplierId && mongoose.isValidObjectId(supplierId))
    filter.supplier = supplierId;
  if (inStock === "true") filter.stock = { $gt: 0 };

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }

  const parsedPage = Math.max(1, Number(page));
  const parsedLimit = Math.min(100, Math.max(1, Number(limit)));

  return {
    filter,
    sort: { [sortBy]: sortOrder === "asc" ? 1 : -1 },
    skip: (parsedPage - 1) * parsedLimit,
    limit: parsedLimit,
    page: parsedPage,
  };
}

// Public: browse materials (active only)
router.get("/", async (req, res, next) => {
  try {
    const { filter, sort, skip, limit, page } = parseListQuery(req.query);
    const [materials, total] = await Promise.all([
      Material.find(filter)
        .populate("supplier", "name businessName address rating profileImage phone deliveryAreas")
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Material.countDocuments(filter),
    ]);
    res.json({
      materials,
      pagination: { total, page, pages: Math.ceil(total / limit), limit },
    });
  } catch (err) {
    next(err);
  }
});

// Supplier: get OWN materials (all statuses, authenticated)
router.get("/supplier/:supplierId", requireAuth, async (req, res, next) => {
  try {
    const { supplierId } = req.params;
    if (!mongoose.isValidObjectId(supplierId))
      return res.status(400).json({ error: "Invalid supplier id" });

    // If the authenticated user IS the supplier, show all (including inactive)
    const isOwner =
      req.user.role === "supplier" &&
      req.user._id.toString() === supplierId;

    const { filter, sort, skip, limit, page } = parseListQuery(
      { ...req.query, supplierId },
      isOwner,
    );

    const [materials, total] = await Promise.all([
      Material.find(filter).sort(sort).skip(skip).limit(limit),
      Material.countDocuments(filter),
    ]);
    res.json({
      materials,
      pagination: { total, page, pages: Math.ceil(total / limit), limit },
    });
  } catch (err) {
    next(err);
  }
});

// Public: get single material
router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ error: "Invalid material id" });
    const material = await Material.findById(req.params.id).populate(
      "supplier",
      "name businessName address phone description rating profileImage deliveryAreas estimatedDeliveryTime minOrderAmount deliveryFee",
    );
    if (!material) return res.status(404).json({ error: "Material not found" });
    res.json({ material });
  } catch (err) {
    next(err);
  }
});

const materialSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  price: z.number().nonnegative(),
  unit: z.string().min(1),
  stock: z.number().nonnegative(),
  description: z.string().optional(),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  minOrderQuantity: z.number().int().positive().optional(),
  maxOrderQuantity: z.number().int().positive().optional(),
  storageInstructions: z.string().optional(),
  shelfLife: z.string().optional(),
  origin: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

router.post("/", requireAuth, requireRole("supplier"), async (req, res, next) => {
  try {
    const data = materialSchema.parse(req.body);
    const material = await Material.create({ ...data, supplier: req.user._id });
    res.status(201).json({ message: "Material created", material });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", requireAuth, requireRole("supplier"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ error: "Invalid material id" });
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ error: "Material not found" });
    if (material.supplier.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "You can only edit your own materials" });

    const updates = materialSchema.partial().parse(req.body);
    Object.assign(material, updates);
    await material.save();
    res.json({ message: "Material updated", material });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAuth, requireRole("supplier"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ error: "Invalid material id" });
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ error: "Material not found" });
    if (material.supplier.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "You can only delete your own materials" });

    await material.deleteOne();
    res.json({ message: "Material deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
