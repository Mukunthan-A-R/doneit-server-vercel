// models/contact.js
const { connectDB, pool } = require("../db/db");

const createContactMessage = async ({ name, email, message }) => {
  const query = `
    INSERT INTO contact_messages (name, email, message)
    VALUES ($1, $2, $3) RETURNING *;
  `;
  const values = [name, email, message];

  try {
    const result = await pool.query(query, values);
    return {
      success: true,
      status: 201,
      data: result.rows[0],
    };
  } catch (err) {
    console.error("DB Insert Error:", err.message);
    return {
      success: false,
      status: 500,
      message: "Failed to save message.",
    };
  }
};

module.exports = {
  createContactMessage,
};
