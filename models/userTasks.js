const { connectDB } = require("../db/db");

// Utility function to handle errors
const handleError = (err) => {
  return {
    success: false,
    status: 500,
    error: err.message || "An unexpected error occurred",
  };
};

// Get all tasks by user_id
const getTasksByUserId = async (userId) => {
  const client = await connectDB();
  const text = `
    SELECT 
      t.task_id,
      t.title,
      t.description,
      t.status,
      t.time_duration,
      t.start_date,
      t.end_date,
      t.created_date,
      p.project_id,
      p.name AS project_name,
      u.user_id,
      u.name AS user_name
    FROM 
      tasks t
    JOIN 
      projects p ON t.project_id = p.project_id
    JOIN 
      users u ON p.created = u.user_id
    WHERE 
      u.user_id = $1
  `;

  try {
    const res = await client.query(text, [userId]);
    return { success: true, status: 200, data: res.rows };
  } catch (err) {
    return handleError(err);
  } finally {
    client.release();
  }
};

module.exports = {
  getTasksByUserId,
};
