import dotenv from "dotenv";
import app from "./src/app.js";
import mongoose from "mongoose";

dotenv.config();

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {

  const checkConnection = () => {
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB is connected. Starting server...");
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } else {
      console.log("Waiting for MongoDB connection...");
      setTimeout(checkConnection, 1000);
    }
  };

  // Start checking after 1 second
  setTimeout(checkConnection, 1000);
}

export { app };