import mongoose from "mongoose";

// Middleware to ensure database is connected before processing requests
const dbMiddleware = async (req, res, next) => {
  // If already connected, proceed
  if (mongoose.connection.readyState === 1) {
    return next();
  }
  
  // If connecting, wait a bit
  if (mongoose.connection.readyState === 2) {
    console.log("Database connecting, waiting...");
    
    // Wait for connection with timeout
    let attempts = 0;
    const maxAttempts = 10;
    
    const checkConnection = setInterval(() => {
      attempts++;
      if (mongoose.connection.readyState === 1) {
        clearInterval(checkConnection);
        clearTimeout(timeout);
        next();
      } else if (attempts >= maxAttempts) {
        clearInterval(checkConnection);
        clearTimeout(timeout);
        res.status(503).json({ message: "Database connection timeout" });
      }
    }, 500);
    
    const timeout = setTimeout(() => {
      clearInterval(checkConnection);
      res.status(503).json({ message: "Database connection timeout" });
    }, 10000);
    
    return;
  }
  
  // Not connected - try to connect
  try {
    console.log("Database not connected, attempting to connect...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully");
    next();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    res.status(500).json({ message: "Database connection failed" });
  }
};

export default dbMiddleware;