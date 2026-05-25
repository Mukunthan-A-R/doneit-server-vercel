const { connectDB } = require("../db/db");

const handleError = (err) => ({
  status: 500,
  message: "Internal server error",
  error: err.message || err,
});

// Fetch projects created by a specific user
const getProjectsByCreator = async (userId) => {
  const client = await connectDB();

  const query = "SELECT * FROM projects WHERE created = $1 ORDER BY start_date";

  try {
    const result = await client.query(query, [userId]);

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
  } finally {
    client.release();
  }
};

module.exports = {
  getProjectsByCreator,
};
