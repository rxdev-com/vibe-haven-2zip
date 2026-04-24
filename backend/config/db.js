import mongoose from "mongoose";

let memoryServer = null;

export async function connectDB() {
  let uri = process.env.MONGODB_URI;

  if (!uri || uri.trim() === "") {
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri();
    console.log("📦 Started in-memory MongoDB at", uri);
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log("✅ MongoDB connected:", mongoose.connection.host);
  return mongoose.connection;
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
