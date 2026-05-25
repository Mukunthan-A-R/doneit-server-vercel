const { connectDB } = require("../db/db");

// Get user by email
const getUserByEmail = async (email) => {
  const client = await connectDB();
  try {
    const res = await client.query(
      `SELECT user_id, name FROM users WHERE email = $1`,
      [email],
    );
    return res.rows[0];
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

// Insert or update reset token
const upsertResetToken = async (userId, token, expiresAt) => {
  const client = await connectDB();
  try {
    await client.query(
      `INSERT INTO password_resets (user_id, token, expires_at)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id) DO UPDATE SET token = $2, expires_at = $3`,
      [userId, token, expiresAt],
    );
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

// Get valid token
const getValidToken = async (token) => {
  const client = await connectDB();
  try {
    const res = await client.query(
      `SELECT user_id FROM password_resets WHERE token = $1 AND expires_at > NOW()`,
      [token],
    );
    return res.rows[0];
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

// Update user password
const updateUserPassword = async (userId, hashedPassword) => {
  const client = await connectDB();
  try {
    await client.query(`UPDATE users SET password = $1 WHERE user_id = $2`, [
      hashedPassword,
      userId,
    ]);
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

// Delete token
const deleteResetToken = async (userId) => {
  const client = await connectDB();
  try {
    await client.query(`DELETE FROM password_resets WHERE user_id = $1`, [
      userId,
    ]);
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  getUserByEmail,
  upsertResetToken,
  getValidToken,
  updateUserPassword,
  deleteResetToken,
};
