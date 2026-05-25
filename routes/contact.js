// routes/contact.js
const express = require("express");
const Joi = require("joi");
const { createContactMessage } = require("../models/contact");

const router = express.Router();

// Validation schema
const contactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  message: Joi.string().min(10).max(600).required(),
});

// POST /api/contact
router.post("/", async (req, res) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const result = await createContactMessage(req.body);
  res.status(result.status).json(result);
});

module.exports = router;
