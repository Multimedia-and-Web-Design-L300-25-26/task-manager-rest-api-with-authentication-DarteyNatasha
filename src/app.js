import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import dbMiddleware from "./middleware/dbMiddleware.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

app.use(dbMiddleware);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

console.log("Initiating MongoDB connection...");
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is not defined in .env file");
} else {
  // Start connection in background
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch(err => {
      console.error("MongoDB connection error:", err.message);
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

export default app;