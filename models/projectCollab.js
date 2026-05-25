// models/projectCollab.js
const { connectDB } = require("../db/db"); // Assuming pool is set up for DB connection

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
  const client = await connectDB();
  const text = "SELECT * FROM user_project_assignments"; // Assuming this is the correct table
  try {
    const res = await client.query(text);
    return { success: true, status: 200, data: res.rows };
  } catch (err) {
    return handleError(err);
  } finally {
    client.release();
  }
};

// Get an assignment by ID
const getAssignmentById = async (id) => {
  const client = await connectDB();
  const text = "SELECT * FROM user_project_assignments WHERE project_id = $1";
  try {
    const res = await client.query(text, [parseInt(id)]);
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
  } finally {
    client.release();
  }
};

// Create a new assignment
const createAssignment = async (data) => {
  const client = await connectDB();
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
    const res = await client.query(text, values);
    return { success: true, status: 201, data: res.rows[0] };
  } catch (err) {
    return handleError(err);
  } finally {
    client.release();
  }
};

// Update an assignment
const updateAssignment = async (id, data) => {
  const client = await connectDB();
  const text = `
    UPDATE user_project_assignments
    SET role = $1, status = $2
    WHERE assignment_id = $3 RETURNING *;
  `;
  const values = [data.role, data.status, parseInt(id)];

  try {
    const res = await client.query(text, values);
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
  } finally {
    client.release();
  }
};

// Delete an assignment
const deleteAssignment = async (id) => {
  const client = await connectDB();
  const text =
    "DELETE FROM user_project_assignments WHERE assignment_id = $1 RETURNING *";

  try {
    const res = await client.query(text, [parseInt(id)]);
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
  } finally {
    client.release();
  }
};

module.exports = {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
};
