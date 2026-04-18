import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

describe("MongoDB Connection", () => {
  it("should connect to MongoDB", async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      expect(mongoose.connection.readyState).toBe(1);
      await mongoose.connection.close();
    } catch (error) {
      // Use expect instead of fail
      expect(error).toBeUndefined();
    }
  });
});