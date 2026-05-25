// model/tasks.js
const { connectDB, pool } = require("../db/db");

// Utility function to handle errors
const handleError = (err) => {
  return {
    success: false,
    status: 500,
    error: err.message || "An unexpected error occurred",
  };
};

// Get all tasks
const getAllTasks = async () => {
  const text = "SELECT * FROM tasks";
  try {
    const res = await pool.query(text);
    return { success: true, status: 200, data: res.rows };
  } catch (err) {
    return handleError(err);
  }
};

// Get a task by ID
const getTask = async (id) => {
  const text = "SELECT * FROM tasks WHERE task_id = $1";
  try {
    const res = await pool.query(text, [parseInt(id)]);
    if (res.rowCount === 0) {
      return {
        success: false,
        status: 404,
        message: `Task with ID ${id} not found.`,
      };
    }
    return { success: true, status: 200, data: res.rows[0] };
  } catch (err) {
    return handleError(err);
  }
};

// Create a new task
const createTask = async (data) => {
  const text = `
    INSERT INTO tasks (project_id, title, description, status, time_duration, start_date, end_date, created_date, created_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE, $8) RETURNING *;
  `;
  const values = [
    data.project_id,
    data.title,
    data.description,
    data.status,
    data.time_duration,
    data.start_date,
    data.end_date,
    data.user.userId,
  ];

  try {
    const res = await pool.query(text, values);
    return { success: true, status: 201, data: res.rows[0] };
  } catch (err) {
    return handleError(err);
  }
};

// Update an existing task
const updateTask = async (id, data) => {
  const text = `
    UPDATE tasks
    SET project_id = $1, title = $2, description = $3, status = $4, time_duration = $5, start_date = $6, end_date = $7
    WHERE task_id = $8 RETURNING *;
  `;
  const values = [
    data.project_id,
    data.title,
    data.description,
    data.status,
    data.time_duration,
    data.start_date,
    data.end_date,
    parseInt(id),
  ];

  try {
    const res = await pool.query(text, values);
    if (res.rowCount === 0) {
      return {
        success: false,
        status: 404,
        message: `Task with ID ${id} not found.`,
      };
    }
    return { success: true, status: 200, data: res.rows[0] };
  } catch (err) {
    return handleError(err);
  }
};

// Delete a task by ID
const deleteTask = async (id) => {
  const text = "DELETE FROM tasks WHERE task_id = $1 RETURNING *";

  try {
    const res = await pool.query(text, [parseInt(id)]);
    if (res.rowCount === 0) {
      return {
        success: false,
        status: 404,
        message: `Task with ID ${id} not found.`,
      };
    }
    return {
      success: true,
      status: 200,
      message: `Task with ID ${id} deleted successfully.`,
    };
  } catch (err) {
    return handleError(err);
  }
};

module.exports = {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
