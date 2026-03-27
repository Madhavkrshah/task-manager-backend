const Task = require("../models/Task");

// Get all tasks for authenticated user
// GET /api/tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// fix: for to write .message on Server error;

// Get single task by ID
// GET /api/tasks/:id
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    if (task.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this task",
      });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Create a Task
// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Update a task
// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    if (task.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this task",
      });
    }

    const updateTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        userId: task.userId,
      }, // prevent userId from being overwritten
      { new: true, runValidators: true },
    );

    res.status(200).json({ success: true, data: updateTask });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete a Task
// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    if (task.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this task",
      });
    }

    await task.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

/*
feat(tasks): implement task controller with full CRUD operations

- getTasks: fetch all tasks for authenticated user
- getTaskById: fetch single task with ownership check
- createTask: create task linked to authenticated user
- updateTask: update task with ownership verification
- deleteTask: delete task with ownership verification
*/

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};

// git commit -m 'fix(taskController): fix missing .message on server error in getTasks' -m '- was passing full error object instead of error.message in getTasks error handler'