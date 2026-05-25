const { connectDB, pool } = require("../db/db");
const { hasProjectAccess } = require("./projectAccess");

const fetchTasksByProjectId = async (userId, projectId) => {
  const sendResponse = (status, success, message, data = null) => ({
    status,
    success,
    message,
    data,
  });

  try {
    // 1. Check access first. Since hasProjectAccess uses pool.query internally,
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

    // 2. Safely borrow a connection slot for the main query using pool.query
    const result = await pool.query(query, [projectId]);

    if (result.rows.length > 0) {
      return sendResponse(200, true, "Tasks fetched successfully", result.rows);
    }

    return sendResponse(200, true, "Create your first Task!", result.rows);
  } catch (err) {
    console.error("fetchTasksByProjectId error:", err);
    return sendResponse(500, false, "Internal server error");
  }
};

module.exports = {
  fetchTasksByProjectId,
};
