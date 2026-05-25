const { connectDB } = require("../db/db");
const bcrypt = require("bcryptjs");

// Change user password after verifying current password
async function changePassword(id, currentPassword, newPassword) {
  const client = await connectDB();

  try {
    // 1. Get current hashed password from DB
    const getUserQuery = "SELECT password FROM users WHERE user_id = $1";
    const userRes = await client.query(getUserQuery, [id]);

    if (userRes.rowCount === 0) {
      return {
        success: false,
        status: 404,
        message: `User with ID ${id} not found.`,
      };
    }

    const hashedPassword = userRes.rows[0].password;

    // 2. Compare currentPassword with stored hash
    const isMatch = await bcrypt.compare(currentPassword, hashedPassword);
    if (!isMatch) {
      return {
        success: false,
        status: 400,
        message: "Current password is incorrect.",
      };
    }

    // 3. Hash new password
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update password in DB
    const updateQuery =
      "UPDATE users SET password = $1 WHERE user_id = $2 RETURNING user_id, name, email, company, role";
    const updateRes = await client.query(updateQuery, [newHashedPassword, id]);

    return {
      success: true,
      status: 200,
      message: "Password updated successfully.",
      data: updateRes.rows[0],
    };
  } catch (err) {
    console.error("Error in changePassword:", err);
    return {
      success: false,
      status: 500,
      error: "An unexpected error occurred while changing password.",
    };
  } finally {
    client.release();
  }
}

module.exports = {
  changePassword,
};
