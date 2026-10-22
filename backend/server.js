
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
}));

app.use(express.json());
// Todo Schema
const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Todo title is required"],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Todo Model
const Todo = mongoose.model("Todo", todoSchema);

// Home Route
app.get("/", (req, res) => {
  res.send("Todo List API is running!");
});

// GET: Fetch all todos
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch todos" });
  }
});

// POST: Create a todo
app.post("/api/todos", async (req, res) => {
  try {
    const { title } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Todo title is required",
      });
    }

    const todo = await Todo.create({
      title: title.trim(),
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: "Failed to create todo" });
  }
});

// PATCH: Update a todo
app.patch("/api/todos/:id", async (req, res) => {
  try {
    const updates = {};

    if (typeof req.body.completed === "boolean") {
      updates.completed = req.body.completed;
    }

    if (typeof req.body.title === "string" && req.body.title.trim()) {
      updates.title = req.body.title.trim();
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Provide a valid title or completed value",
      });
    }

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(todo);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid todo ID" });
    }

    res.status(500).json({ message: "Failed to update todo" });
  }
});

// DELETE: Delete a todo
app.delete("/api/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({
      message: "Todo deleted successfully",
      todo,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid todo ID" });
    }

    res.status(500).json({ message: "Failed to delete todo" });
  }
});

// Connect to MongoDB and start server
async function startServer() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb://127.0.0.1:27017/todo_devops"
    );

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Todo API running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
