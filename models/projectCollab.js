// models/projectCollab.js
const { connectDB, pool } = require("../db/db");

// Utility function to handle errors
const handleError = (err) => {
  return {
    success: false,
    status: 500,
    error: err.message || "An unexpected error occurred",
  };
};

// Get all assignments
const getAllAssignments = async () => {
  const text = "SELECT * FROM user_project_assignments";
  try {
    const res = await pool.query(text);
    return { success: true, status: 200, data: res.rows };
  } catch (err) {
    return handleError(err);
  }
};

// Get an assignment by ID
const getAssignmentById = async (id) => {
  const text = "SELECT * FROM user_project_assignments WHERE project_id = $1";
  try {
    const res = await pool.query(text, [parseInt(id)]);
    if (res.rowCount === 0) {
      return {
        success: false,
        status: 404,
        message: `Assignment with ID ${id} not found.`,
      };
    }
    return { success: true, status: 200, data: res.rows };
  } catch (err) {
    return handleError(err);
  }
};

// Create a new assignment
const createAssignment = async (data) => {
  const text = `
    INSERT INTO user_project_assignments (user_id, project_id, role, status)
    VALUES ($1, $2, $3, $4) RETURNING *;
  `;
  const values = [
    data.user_id,
    data.project_id,
    data.role,
    data.status || "pending",
  ];

  try {
    const res = await pool.query(text, values);
    return { success: true, status: 201, data: res.rows[0] };
  } catch (err) {
    return handleError(err);
  }
};

// Update an assignment
const updateAssignment = async (id, data) => {
  const text = `
    UPDATE user_project_assignments
    SET role = $1, status = $2
    WHERE assignment_id = $3 RETURNING *;
  `;
  const values = [data.role, data.status, parseInt(id)];

  try {
    const res = await pool.query(text, values);
    if (res.rowCount === 0) {
      return {
        success: false,
        status: 404,
        message: `Assignment with ID ${id} not found.`,
      };
    }
    return { success: true, status: 200, data: res.rows[0] };
  } catch (err) {
    return handleError(err);
  }
};

// Delete an assignment
const deleteAssignment = async (id) => {
  const text =
    "DELETE FROM user_project_assignments WHERE assignment_id = $1 RETURNING *";

  try {
    const res = await pool.query(text, [parseInt(id)]);
    if (res.rowCount === 0) {
      return {
        success: false,
        status: 404,
        message: `Assignment with ID ${id} not found.`,
      };
    }
    return {
      success: true,
      status: 200,
      message: `Assignment with ID ${id} deleted successfully.`,
    };
  } catch (err) {
    return handleError(err);
  }
};

module.exports = {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
};
