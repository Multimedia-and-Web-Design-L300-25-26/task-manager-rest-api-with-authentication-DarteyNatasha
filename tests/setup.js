import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "../src/app.js";

// Load environment variables
dotenv.config();

console.log("Test environment loaded with MONGO_URI:", 
  process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 50) + "..." : "MISSING");

// Ensure MongoDB is connected before any tests run
beforeAll(async () => {
  console.log("Setting up test database connection...");
  
  // If already connected, we're good to go
  if (mongoose.connection.readyState === 1) {
    console.log("Already connected to MongoDB");
    return;
  }

  // If connecting, wait for it
  if (mongoose.connection.readyState === 2) {
    console.log("MongoDB is connecting, waiting...");
    await new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (mongoose.connection.readyState === 1) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
    console.log("MongoDB connected");
    return;
  }

  // Not connected, connect now
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected in setup");
  } catch (error) {
    console.error("MongoDB connection failed in setup:", error.message);
    throw error;
  }
});

// Clear database BEFORE ALL TESTS start, not between each test
beforeAll(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    console.log("Database cleared before all tests");
  }
});


// Clean up after all tests
afterAll(async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed");
});

export default app;