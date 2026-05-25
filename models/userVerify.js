const { connectDB } = require("../db/db");

// ✅ Update user activation status to true
const verifyUserById = async (userId) => {
  const client = await connectDB();
  const query = `
      UPDATE users
      SET is_activated = TRUE
      WHERE user_id = $1
      RETURNING user_id, name, email, company, role, is_activated
    `;

  try {
    const res = await client.query(query, [userId]);

    if (res.rows.length === 0) {
      return { success: false, status: 404, message: "User not found" };
    }

    return { success: true, status: 200, data: res.rows[0] };
  } catch (err) {
    return { message: err.message, status: 500, success: false };
  } finally {
    client.release();
  }
};

module.exports = {
  verifyUserById,
};
