const express = require("express");
const router = express.Router();
const Joi = require("joi");
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../models/users"); // Model functions

// JOI Schema
const userSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  company: Joi.string().min(3).max(128).required(),
});

function validateUser(data) {
  return userSchema.validate(data, { abortEarly: false });
}

// Get all users
router.get("/", async (req, res) => {
  const data = await getAllUsers();
  res.status(data.status).send(data);
});

// Get user by ID
router.get("/:id", async (req, res) => {
  const data = await getUser(req.params.id);
  res.status(data.status).send(data);
});

// Create new user
router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send({ errors: error.details });

  const data = await createUser(req.body);
  res.status(data.status).send(data);
});

// Update user
router.put("/:id", async (req, res) => {
  // const { error } = validateUser(req.body);
  // if (error) return res.status(400).send({ errors: error.details });

  const data = await updateUser(req.params.id, req.body);
  res.status(data.status).send(data);
});

// Delete user
router.delete("/:id", async (req, res) => {
  const data = await deleteUser(req.params.id);
  res.status(data.status).send(data);
});

module.exports = router;
