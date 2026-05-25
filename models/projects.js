// model/projects.js
const { connectDB, pool } = require("../db/db");

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
  const text = "SELECT * FROM projects";
  try {
    // pool.query handles checkout and release automatically
    const res = await pool.query(text);
    return { success: true, status: 200, data: res.rows };
  } catch (err) {
    return handleError(err);
  }
};

// Get a project by ID
const getProject = async (id) => {
  const text = "SELECT * FROM projects WHERE project_id = $1";
  try {
    const res = await pool.query(text, [parseInt(id)]);
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
  }
};

// Create a new project
const createProject = async (data) => {
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
    data.created,
  ];

  try {
    const res = await pool.query(text, values);
    return { success: true, status: 201, data: res.rows[0] };
  } catch (err) {
    return handleError(err);
  }
};

// Update an existing project
const updateProject = async (id, data) => {
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
    const res = await pool.query(text, values);
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
  }
};

// Delete a project by ID
const deleteProject = async (id) => {
  const text = "DELETE FROM projects WHERE project_id = $1 RETURNING *";

  try {
    const res = await pool.query(text, [parseInt(id)]);
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
  }
};

module.exports = {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};
