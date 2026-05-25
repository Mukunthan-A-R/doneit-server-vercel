// model/projects.js
const { connectDB } = require("../db/db"); // Assuming pool is set up for DB connection

// Utility function to handle errors
const handleError = (err) => {
  return {
    success: false,
    status: 500,
    error: err.message || "An unexpected error occurred",
  };
};

// Get all projects
const getAllProjects = async () => {
  const client = await connectDB();
  const text = "SELECT * FROM projects"; // Assuming 'projects' is the table name
  try {
    const res = await client.query(text);
    return { success: true, status: 200, data: res.rows };
  } catch (err) {
    return handleError(err);
  } finally {
    client.release();
  }
};

// Get a project by ID
const getProject = async (id) => {
  const client = await connectDB();
  const text = "SELECT * FROM projects WHERE project_id = $1";
  try {
    const res = await client.query(text, [parseInt(id)]);
    if (res.rowCount === 0) {
      return {
        success: false,
        status: 404,
        message: `Project with ID ${id} not found.`,
      };
    }
    return { success: true, status: 200, data: res.rows[0] };
  } catch (err) {
    return handleError(err);
  } finally {
    client.release();
  }
};

// Create a new project
const createProject = async (data) => {
  const client = await connectDB();
  const text = `
    INSERT INTO projects (name, description, start_date, end_date, status, priority, created)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
  `;
  const values = [
    data.name,
    data.description,
    data.start_date,
    data.end_date,
    data.status,
    data.priority,
    data.created, // This should be the user_id of the creator
  ];

  try {
    const res = await client.query(text, values);
    return { success: true, status: 201, data: res.rows[0] };
  } catch (err) {
    return handleError(err);
  } finally {
    client.release();
  }
};

// Update an existing project
const updateProject = async (id, data) => {
  const client = await connectDB();
  const text = `
    UPDATE projects
    SET name = $1, description = $2, start_date = $3, end_date = $4, status = $5, priority = $6
    WHERE project_id = $7 RETURNING *;
  `;
  const values = [
    data.name,
    data.description,
    data.start_date,
    data.end_date,
    data.status,
    data.priority,
    parseInt(id),
  ];

  try {
    const res = await client.query(text, values);
    if (res.rowCount === 0) {
      return {
        success: false,
        status: 404,
        message: `Project with ID ${id} not found.`,
      };
    }
    return { success: true, status: 200, data: res.rows[0] };
  } catch (err) {
    return handleError(err);
  } finally {
    client.release();
  }
};

// Delete a project by ID
const deleteProject = async (id) => {
  const client = await connectDB();
  const text = "DELETE FROM projects WHERE project_id = $1 RETURNING *";

  try {
    const res = await client.query(text, [parseInt(id)]);
    if (res.rowCount === 0) {
      return {
        success: false,
        status: 404,
        message: `Project with ID ${id} not found.`,
      };
    }
    return {
      success: true,
      status: 200,
      message: `Project with ID ${id} deleted successfully.`,
    };
  } catch (err) {
    return handleError(err);
  } finally {
    client.release();
  }
};

module.exports = {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};
