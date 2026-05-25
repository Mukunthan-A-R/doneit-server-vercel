const { connectDB, pool } = require("../db/db");

async function getActivityLogsByProject(projectId) {
  try {
    const query = `
      SELECT log_id, user_id, project_id, task_id, action, description, timestamp
      FROM project_activity_logs
      WHERE project_id = $1
      ORDER BY timestamp DESC
    `;
    const res = await pool.query(query, [projectId]);
    return { success: true, data: res.rows };
  } catch (error) {
    console.error("DB Error:", error);
    return { success: false, error: "Failed to fetch activity logs" };
  }
}

async function createActivityLog({
  user_id,
  project_id,
  task_id,
  action,
  description,
}) {
  // Validate fields BEFORE touching the pool configuration
  if (!user_id || !project_id || !action || !description) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    const query = `
      INSERT INTO project_activity_logs (user_id, project_id, task_id, action, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [user_id, project_id, task_id || null, action, description];
    const res = await pool.query(query, values);
    return { success: true, data: res.rows[0] };
  } catch (error) {
    console.error("DB Error:", error);
    return { success: false, error: "Failed to create activity log" };
  }
}

module.exports = {
  getActivityLogsByProject,
  createActivityLog,
};
