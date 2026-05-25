// models/fetchCollabProjects.js
const { connectDB } = require("../db/db");

const handleError = (err) => ({
  success: false,
  status: 500,
  message: err.message || "Unexpected error occurred",
});

const getProjectsByUser = async (userId) => {
  const client = await connectDB();
  const query = `
SELECT 
  p.project_id,
  p.name,
  p.description,
  p.status,
  p.priority,
  p.start_date,
  p.end_date,
  upa.role,
  upa.status AS invitation_status,
  upa.assigned_at
FROM user_project_assignments upa
JOIN projects p ON upa.project_id = p.project_id
WHERE upa.user_id = $1

  `;

  try {
    const res = await client.query(query, [userId]);
    return { success: true, status: 200, data: res.rows };
  } catch (err) {
    return handleError(err);
  } finally {
    client.release();
  }
};

module.exports = {
  getProjectsByUser,
};
