const express = require("express");
const { connectDB, pool } = require("../db/db");
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

  try {
    // 1. Hash the password BEFORE touching the database connection
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Insert new user into the database via pool.query (Auto opens & closes)
    const insertUserQuery =
      "INSERT INTO users (name, email, password , company , role) VALUES ($1, $2, $3, $4 ,$5) RETURNING user_id, name, email";

    const newUser = await pool.query(insertUserQuery, [
      name,
      email,
      hashedPassword,
      company,
      role,
    ]);

    const user = newUser.rows[0];

    // 3. Create free trial subscription
    const trialResponse = await createSubscription(user.user_id);
    if (!trialResponse.success) {
      return res.status(500).json({ message: trialResponse.message });
    }

    if (newUser && newUser.rows.length > 0) {
      const doneItServer = process.env.DONE_IT_SERVER;
      const activationLink = `${doneItServer}/api/user/activate/${user.user_id}`;

      // 4. Send email safely without dragging down database slots
      await confirmEmail(email, name, activationLink);
    } else {
      return res
        .status(500)
        .json({ message: "Failed to Register User System Error" });
    }

    return res.status(201).json({
      message: "User registered successfully",
      user: user,
    });
  } catch (err) {
    console.error(err);
    if (err instanceof DatabaseError) {
      if (err.constraint === "users_email_key") {
        return res.status(400).json({ message: "Email already exists" });
      }
    }
    return res.status(500).json({ message: "Server error" });
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
