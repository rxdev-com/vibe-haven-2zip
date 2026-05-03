import User from "../models/User.js";
import Material from "../models/Material.js";

const DEMO_VENDOR = {
  name: "Rajesh Kumar",
  email: "vendor@example.com",
  password: "vendor123",
  phone: "+91 98765 43210",
  role: "vendor",
  businessName: "Rajesh's Chaat Corner",
  address: "Sector 15, Noida, Uttar Pradesh",
  description: "Serving delicious North Indian street food since 2015",
  specialties: ["Chaat", "Pani Puri", "Dahi Bhalla"],
  isVerified: true,
  emailVerified: true,
  location: { type: "Point", coordinates: [77.391, 28.5355] },
};

const DEMO_SUPPLIER = {
  name: "Priya Sharma",
  email: "supplier@example.com",
  password: "supplier123",
  phone: "+91 99887 66554",
  role: "supplier",
  businessName: "Priya Raw Materials Supply",
  address: "Industrial Area, Sector 62, Noida, Uttar Pradesh",
  description: "Leading supplier of premium quality oils and fats for the food industry. Serving Delhi NCR since 1998 with authentic and pure products.",
  categories: ["Spices", "Oil", "Grains", "Pulses"],
  deliveryAreas: ["Delhi", "Noida", "Gurgaon", "Faridabad", "Greater Noida"],
  businessType: "Wholesale Distributor",
  license: "FSSAI-12345678901234",
  gstNumber: "09AABCU9603R1ZX",
  panNumber: "AABCU9603R",
  fssaiLicense: "FSSAI-12345678901234",
  establishedYear: "1998",
  deliveryFee: 50,
  freeDeliveryAbove: 1000,
  minOrderAmount: 500,
  maxDeliveryDistance: 25,
  estimatedDeliveryTime: "2-4 hours",
  acceptingOrders: true,
  isVerified: true,
  emailVerified: true,
  rating: 4.8,
  totalRatings: 186,
  totalOrders: 186,
  totalRevenue: 720000,
  location: { type: "Point", coordinates: [77.4538, 28.6692] },
};

const DEMO_MATERIALS = [
  {
    name: "Premium Mustard Oil",
    category: "Oil",
    price: 180,
    unit: "litre",
    stock: 200,
    description: "Cold-pressed pure mustard oil, perfect for Indian cooking",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400",
    tags: ["oil", "mustard", "cooking", "premium"],
    minOrderQuantity: 5,
    maxOrderQuantity: 100,
    storageInstructions: "Store in a cool, dry place away from sunlight",
    shelfLife: "12 months",
    origin: "Rajasthan",
    certifications: ["FSSAI", "ISO 9001"],
  },
  {
    name: "Basmati Rice (Premium)",
    category: "Grains",
    price: 120,
    unit: "kg",
    stock: 500,
    description: "Long-grain aged basmati rice, fragrant and fluffy",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
    tags: ["rice", "basmati", "grains"],
    minOrderQuantity: 10,
    maxOrderQuantity: 500,
    shelfLife: "24 months",
    origin: "Haryana",
  },
  {
    name: "Garam Masala (Homemade Blend)",
    category: "Spices",
    price: 320,
    unit: "kg",
    stock: 80,
    description: "House-blended garam masala with 12 traditional spices",
    image: "https://images.unsplash.com/photo-1599909533734-cb5180b78a3a?w=400",
    tags: ["spices", "masala", "garam"],
    minOrderQuantity: 1,
    maxOrderQuantity: 50,
    shelfLife: "12 months",
  },
  {
    name: "Toor Dal (Yellow Pigeon Pea)",
    category: "Pulses",
    price: 140,
    unit: "kg",
    stock: 350,
    description: "High-quality unpolished toor dal",
    image: "https://images.unsplash.com/photo-1604908554002-c45d2b40d1d4?w=400",
    tags: ["dal", "pulses", "toor"],
    minOrderQuantity: 5,
    maxOrderQuantity: 200,
    origin: "Maharashtra",
  },
  {
    name: "Refined Sunflower Oil",
    category: "Oil",
    price: 145,
    unit: "litre",
    stock: 300,
    description: "Light, refined sunflower oil for everyday cooking",
    image: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400",
    tags: ["oil", "sunflower", "refined"],
    minOrderQuantity: 5,
    maxOrderQuantity: 150,
    shelfLife: "12 months",
  },
  {
    name: "Whole Wheat Atta",
    category: "Grains",
    price: 45,
    unit: "kg",
    stock: 600,
    description: "Stone-ground whole wheat flour",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400",
    tags: ["atta", "wheat", "flour"],
    minOrderQuantity: 10,
    maxOrderQuantity: 500,
  },
  {
    name: "Premium Basmati Rice",
    category: "Grains",
    price: 120,
    unit: "kg",
    stock: 400,
    description: "Extra long grain premium basmati rice",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
    tags: ["rice", "basmati", "premium"],
    minOrderQuantity: 5,
    maxOrderQuantity: 300,
    shelfLife: "18 months",
    origin: "Punjab",
  },
];

export async function seedDemoData() {
  const userCount = await User.countDocuments();
  if (userCount > 0) {
    console.log("ℹ️  Skipping seed (database already has data).");
    return;
  }

  console.log("🌱 Seeding demo data...");

  const vendor = await User.create(DEMO_VENDOR);
  const supplier = await User.create(DEMO_SUPPLIER);

  await Material.insertMany(
    DEMO_MATERIALS.map((m) => ({ ...m, supplier: supplier._id })),
  );

  console.log("✅ Demo data seeded:");
  console.log(`   • Vendor:   ${vendor.email}   (password: vendor123)`);
  console.log(`   • Supplier: ${supplier.email} (password: supplier123)`);
  console.log(`   • ${DEMO_MATERIALS.length} demo materials`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { connectDB, disconnectDB } = await import("../config/db.js");
  await connectDB();
  await seedDemoData();
  await disconnectDB();
  process.exit(0);
}
