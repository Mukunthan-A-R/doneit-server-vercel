// models/userEmail.js
const { connectDB, pool } = require("../db/db");

// Utility function to handle errors
const handleError = (err) => {
  return {
    success: false,
    status: 500,
    error: err.message || "An unexpected error occurred",
  };
};

// Get a user by email
const getUserByEmail = async (email) => {
  const text = "SELECT * FROM users WHERE email = $1";

  try {
    const res = await pool.query(text, [email]);
    if (res.rowCount === 0) {
      return {
        success: false,
        status: 404,
        message: `User with email ${email} not found.`,
      };
    }

    // If user is found, return user data excluding password for security
    const { password, ...user } = res.rows[0];
    return { success: true, status: 200, data: user };
  } catch (err) {
    return handleError(err);
  }
};

module.exports = {
  getUserByEmail,
};
