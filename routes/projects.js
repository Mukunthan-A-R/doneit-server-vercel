// routes/projects.js
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require("../models/projects"); // Importing the model functions

// Get all projects
router.get("/", async (req, res) => {
  const data = await getAllProjects();
  res.status(data.status).send(data);
});

// Get a project by ID
router.get("/:id", async (req, res) => {
  const data = await getProject(req.params.id);
  res.status(data.status).send(data);
});

// Create a new project
router.post("/", async (req, res) => {
  const { error } = validateProject(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const data = await createProject(req.body);
  res.status(data.status).send(data);
});

// Update an existing project
router.put("/:id", async (req, res) => {
  const { error } = validateProject(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const data = await updateProject(req.params.id, req.body);
  res.status(data.status).send(data);
});

// Delete a project by ID
router.delete("/:id", async (req, res) => {
  const data = await deleteProject(req.params.id);
  res.status(data.status).send(data);
});

// Project Schema using Joi for validation
const projectSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().min(1).max(500).optional(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
  status: Joi.string().valid("active", "completed", "on-hold").optional(),
  priority: Joi.string().valid("low", "medium", "high").optional(),
  created: Joi.number().required(), // Assuming 'created' is the user_id
});

// Function to validate the project data using Joi
function validateProject(data) {
  return projectSchema.validate(data);
}

module.exports = router;
