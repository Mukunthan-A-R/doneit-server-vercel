const express = require("express");
const { connectDB } = require("../db/db");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const confirmEmail = require("../utils/confirmEmail");
const { createSubscription } = require("../models/subscription");
const { DatabaseError } = require("pg");

const router = express.Router();
// Middleware to parse JSON
router.use(express.json());

// Register Endpoint
router.post("/", async (req, res) => {
  const { name, email, password, company, role } = req.body;

  const { error } = validate({ name, email, password, company, role });
  if (error) return res.status(400).send(error.details[0].message);

  const client = await connectDB();

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert new user into the database
  const insertUserQuery =
    "INSERT INTO users (name, email, password , company , role) VALUES ($1, $2, $3, $4 ,$5) RETURNING user_id, name, email";
  try {
    const newUser = await client.query(insertUserQuery, [
      name,
      email,
      hashedPassword,
      company,
      role,
    ]);

    const user = newUser.rows[0];

    // Create free trial subscription
    const trialResponse = await createSubscription(user.user_id);
    if (!trialResponse.success) {
      return res.status(500).json({ message: trialResponse.message });
    }

    if (newUser) {
      const doneItServer = process.env.DONE_IT_SERVER;
      const activationLink = `${doneItServer}/api/user/activate/${newUser.rows[0].user_id}`;

      await confirmEmail(email, name, activationLink);
      // console.log(process.env.EMAIL_USER, process.env.EMAIL_APP_PASSWORD);
    } else {
      console.error(err);
      res.status(500).json({ message: "Failed to Register User System Error" });
    }
    res.status(201).json({
      message: "User registered successfully",
      user: newUser.rows[0],
    });
  } catch (err) {
    console.error(err);
    if (err instanceof DatabaseError) {
      if (err.constraint === "users_email_key") {
        return res.status(400).json({ message: "Email already exists" });
      }
    }
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
});

module.exports = router;

// Joi schema for user registration
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  company: Joi.string().min(3).max(128).required(),
  role: Joi.string().min(2).max(128).required(),
});

function validate(data) {
  return registerSchema.validate(data);
}
