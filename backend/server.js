import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import { connectDB } from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.js";
import materialRoutes from "./routes/materials.js";
import orderRoutes from "./routes/orders.js";
import notificationRoutes from "./routes/notifications.js";
import savedRoutes from "./routes/saved.js";
import cartRoutes from "./routes/cart.js";
import userRoutes from "./routes/users.js";
import { seedDemoData } from "./utils/seed.js";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

const corsOrigin = process.env.CORS_ORIGIN || "*";
app.use(
  cors({
    origin: corsOrigin === "*" ? true : corsOrigin.split(",").map((s) => s.trim()),
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

// Health check
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong", timestamp: new Date().toISOString() });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/users", userRoutes);

// 404 + error handlers
app.use("/api", notFound);
app.use(errorHandler);

async function start() {
  try {
    await connectDB();

    if (process.env.SEED_ON_START !== "false") {
      await seedDemoData();
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Backend listening on http://0.0.0.0:${PORT}`);
      console.log(`   API base:   http://0.0.0.0:${PORT}/api`);
      console.log(`   Health:     http://0.0.0.0:${PORT}/api/health`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
