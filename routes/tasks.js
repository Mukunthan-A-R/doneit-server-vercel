// routes/tasks.js
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require("../models/tasks"); // Importing the model functions

// Get all tasks
router.get("/", async (req, res) => {
  const data = await getAllTasks();
  res.status(data.status).send(data);
});

// Get a task by ID
router.get("/:id", async (req, res) => {
  const data = await getTask(req.params.id);
  res.status(data.status).send(data);
});

// Create a new task
router.post("/", async (req, res) => {
  const { error } = validateTask(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const data = await createTask({ ...req.body, user: req.user });
  res.status(data.status).send(data);
});

// Update an existing task
router.put("/:id", async (req, res) => {
  const { error } = validateTask(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const data = await updateTask(req.params.id, { ...req.body, user: req.user });
  res.status(data.status).send(data);
});

// Delete a task by ID
router.delete("/:id", async (req, res) => {
  const data = await deleteTask(req.params.id);
  res.status(data.status).send(data);
});

// Task Schema using Joi for validation
const taskSchema = Joi.object({
  project_id: Joi.number().required(), // Project ID must be provided
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().min(1).max(1000).optional(),
  status: Joi.string()
    .valid("not started", "in progress", "completed")
    .optional(),
  time_duration: Joi.number().min(1).max(10000).optional(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
});

// Function to validate the task data using Joi
function validateTask(data) {
  return taskSchema.validate(data);
}

module.exports = router;
