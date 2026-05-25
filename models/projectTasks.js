const { connectDB } = require("../db/db");
const { hasProjectAccess } = require("./projectAccess");

const fetchTasksByProjectId = async (userId, projectId) => {
  const client = await connectDB();

  const sendResponse = (status, success, message, data = null) => ({
    status,
    success,
    message,
    data,
  });

  try {
    const accessGranted = await hasProjectAccess(userId, projectId);
    if (!accessGranted) {
      return sendResponse(403, false, "Access denied");
    }

    const query = `
      SELECT t.*, u.name 
      FROM tasks t
      LEFT JOIN users u ON u.user_id = t.created_by
      WHERE t.project_id = $1
    `;

    const result = await client.query(query, [projectId]);

    if (result.rows.length > 0) {
      return sendResponse(200, true, "Tasks fetched successfully", result.rows);
    }

    return sendResponse(200, true, "Create your first Task!", result.rows);
  } catch (err) {
    console.error("fetchTasksByProjectId error:", err);
    return sendResponse(500, false, "Internal server error");
  } finally {
    client.release();
  }
};

module.exports = {
  fetchTasksByProjectId,
};
