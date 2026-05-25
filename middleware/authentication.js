const express = require("express");
// Pulled pool out alongside connectDB without changing the import path
const { connectDB, pool } = require("../db/db");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { verifyUserById } = require("../models/userVerify");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Login Endpoint
router.post("/login", async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password } = req.body;

  try {
    const checkUserQuery = "SELECT * FROM users WHERE email = $1";
    // 1. pool.query auto-manages the lifecycle instantly
    const userResult = await pool.query(checkUserQuery, [email]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = userResult.rows[0];

    // ✅ Check if user is activated
    if (!user.is_activated) {
      return res
        .status(403)
        .json({ message: "Account not activated. Please verify your email." });
    }

    // 2. Heavy CPU task (bcrypt.compare) runs while DB connection is already closed!
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Remove the password field before sending user data
    const { password: _, ...userData } = user;

    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    const cookieExpiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000);

    return res
      .cookie("doneit-session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: cookieExpiryTime,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      })
      .json({
        message: "Login successful",
        token,
        user: userData,
      });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /users/activate/:id
router.get("/user/activate/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    // Ensure verifyUserById internally uses pool.query as well!
    const user = await verifyUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const templatePath = path.join(__dirname, "../views/activation.html");
    let html = fs.readFileSync(templatePath, "utf8");

    html = html.replace("{{APP_URL}}", process.env.DONE_IT_CLIENT || "#");

    return res.send(html);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Protected Route Example
router.get("/profile", (req, res) => {
  const { userId, email } = req.user;
  return res
    .status(200)
    .json({ message: "Profile accessed", user: { userId, email } });
});

router.get("/auth/me", async (req, res) => {
  try {
    const cookies = req.cookies;
    const token = cookies["doneit-session"];
    const decoded = jwt.verify(token, JWT_SECRET);

    const checkUserQuery = "SELECT * FROM users WHERE user_id = $1";
    // 3. Changed to pool.query to avoid early return leaks during token check failures
    const userResult = await pool.query(checkUserQuery, [decoded.userId]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const user = userResult.rows[0];
    const { password: _, ...userData } = user;

    return res.send({
      message: "Authentication successful!",
      token,
      user: userData,
    });
  } catch (err) {
    console.log("🚀 ~ router.get ~ err:", err);
    return res
      .cookie("doneit-session", "", {
        expires: new Date(0), // Set an explicit date object for safety
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      })
      .status(401)
      .json({ message: "Auth token Expired" });
  }
});

router.get("/auth/logout", (req, res) => {
  return res
    .cookie("doneit-session", "", {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    })
    .json({ message: "Logout successful" });
});

module.exports = router;

// Joi schema for login validation
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(50).required(),
});
