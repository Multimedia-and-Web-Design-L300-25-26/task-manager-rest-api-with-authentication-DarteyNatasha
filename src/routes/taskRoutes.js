import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware to all task routes
router.use(authMiddleware);

// POST /api/tasks
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validate input
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Create task with owner
    const task = new Task({
      title,
      description: description || "",
      owner: req.userId || req.user._id
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/tasks
router.get("/", async (req, res) => {
  try {
    // Find tasks belonging to the authenticated user
    const tasks = await Task.find({ owner: req.userId || req.user._id });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check ownership
    if (task.owner.toString() !== (req.userId || req.user._id).toString()) {
      return res.status(403).json({ message: "Not authorized to delete this task" });
    }

    await task.deleteOne();
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid task ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

export default router;