const express = require("express");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const sendPasswordResetEmail = require("../utils/passwordReset");
const {
  getUserByEmail,
  upsertResetToken,
  getValidToken,
  updateUserPassword,
  deleteResetToken,
} = require("../models/passwordReset");

const router = express.Router();

// POST /reset/request
router.post("/request", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await getUserByEmail(email);

    if (!user) return res.status(404).json({ message: "User not found" });

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await upsertResetToken(user.user_id, token, expiresAt);

    const resetUrl = `${process.env.DONE_IT_CLIENT}/forgot-password/${token}`;
    await sendPasswordResetEmail(email, user.name, resetUrl);

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /reset/confirm
router.post("/confirm", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const tokenData = await getValidToken(token);
    if (!tokenData)
      return res.status(400).json({ message: "Invalid or expired token" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(tokenData.user_id, hashed);
    await deleteResetToken(tokenData.user_id);

    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
