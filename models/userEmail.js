// models/userEmail.js
const { connectDB } = require("../db/db"); // Assuming pool is set up for DB connection

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
  const client = await connectDB();
  const text = "SELECT * FROM users WHERE email = $1"; // Query to find user by email

  try {
    const res = await client.query(text, [email]);
    if (res.rowCount === 0) {
      return {
        success: false,
        status: 404,
        message: `User with email ${email} not found.`,
      };
    }
    // If user is found, return user data excluding password for security
    const { password, ...user } = res.rows[0]; // Excluding password for security reasons
    return { success: true, status: 200, data: user };
  } catch (err) {
    return handleError(err);
  } finally {
    client.release();
  }
};

module.exports = {
  getUserByEmail,
};
