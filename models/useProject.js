const { connectDB, pool } = require("../db/db");

const handleError = (err) => ({
  status: 500,
  message: "Internal server error",
  error: err.message || err,
});

// Fetch projects created by a specific user
const getProjectsByCreator = async (userId) => {
  const query = "SELECT * FROM projects WHERE created = $1 ORDER BY start_date";

  try {
    const result = await pool.query(query, [userId]);

    if (result.rows.length > 0) {
      return {
        status: 200,
        data: result.rows,
        message: "Projects retrieved successfully.",
      };
    }

    return {
      status: 404,
      data: [],
      message: "No projects found for this user.",
    };
  } catch (err) {
    console.error("Error in getProjectsByCreator:", err);
    return handleError(err);
  }
};

module.exports = {
  getProjectsByCreator,
};
