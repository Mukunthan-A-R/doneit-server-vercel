const express = require("express");
const router = express.Router();
const Joi = require("joi");

const { changePassword } = require("../models/userPassword");

// Joi schema to validate request body
const passwordSchema = Joi.object({
  currentPassword: Joi.string().min(6).max(128).required(),
  newPassword: Joi.string().min(6).max(128).required(),
});

router.put("/:id", async (req, res) => {
  const { error } = passwordSchema.validate(req.body);
  if (error) return res.status(400).send({ errors: error.details });

  const userId = req.params.id;
  const { currentPassword, newPassword } = req.body;
  const result = await changePassword(userId, currentPassword, newPassword);

  res.status(result.status).send(result);
});

module.exports = router;
