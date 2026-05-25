const { connectDB, disconnectDB } = require("../db/db");

// This function only returns true or false — no res interaction
async function hasProjectAccess(userId, projectId) {
  const accessQuery = `
    SELECT 1
    FROM projects p
    LEFT JOIN user_project_assignments upa
      ON p.project_id = upa.project_id AND upa.user_id = $2
    WHERE p.project_id = $1 AND (p.created = $2 OR upa.user_id IS NOT NULL)
    LIMIT 1;
  `;
  const client = await connectDB();
  try {
    const { rows } = await client.query(accessQuery, [projectId, userId]);
    return rows.length > 0;
  } catch (error) {
    console.error("Error checking project access:", error);
    return false; // optionally return false or throw if you prefer
  } finally {
    client.release();
  }
}

module.exports = { hasProjectAccess };
