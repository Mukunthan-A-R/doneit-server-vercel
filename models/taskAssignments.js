const { connectDB } = require("../db/db");

const handleError = (err) => ({
  success: false,
  status: 500,
  error: err.message || "An unexpected error occurred",
});

const assignUserToTask = async ({ task_id, user_id, assigned_by }) => {
  const client = await connectDB();

  try {
    // Step 1: Get the project_id of the task
    const taskResult = await client.query(
      `SELECT project_id FROM tasks WHERE task_id = $1`,
      [task_id]
    );

    if (taskResult.rowCount === 0) {
      return {
        success: false,
        status: 404,
        message: "Task not found",
      };
    }

    const project_id = taskResult.rows[0].project_id;

    // Step 2: Check if the user is a member of the project (and not a client)
    // Step 2: Check if the user is a valid member or the project creator
    const memberCheck = await client.query(
      `
  SELECT 1 FROM user_project_assignments 
  WHERE user_id = $1 AND project_id = $2 AND role != 'client'
  
  UNION
  
  SELECT 1 FROM projects 
  WHERE project_id = $2 AND created = $1
  `,
      [user_id, project_id]
    );

    if (memberCheck.rowCount === 0) {
      return {
        success: false,
        status: 403,
        message: "User is not a valid project member (or is a client)",
      };
    }

    // Step 3: Insert into task_assignments if not already exists
    const insertQuery = `
      INSERT INTO task_assignments (task_id, user_id, assigned_by)
      VALUES ($1, $2, $3)
      ON CONFLICT (task_id, user_id) DO NOTHING
      RETURNING *;
    `;

    const result = await client.query(insertQuery, [
      task_id,
      user_id,
      assigned_by,
    ]);

    return {
      success: true,
      status: 201,
      data: result.rows[0] || {},
      message:
        result.rowCount > 0
          ? "Assignment created successfully"
          : "User is already assigned to this task",
    };
  } catch (err) {
    return handleError(err); // Your global error handler
  } finally {
    client.release();
  }
};

const removeUserFromTask = async ({ task_id, user_id }) => {
  const client = await connectDB();

  const query = `
    DELETE FROM task_assignments
    WHERE task_id = $1 AND user_id = $2
    RETURNING *
  `;

  try {
    const res = await client.query(query, [task_id, user_id]);
    if (res.rowCount === 0) {
      return {
        success: false,
        status: 404,
        message: "Assignment not found",
      };
    }

    return {
      success: true,
      status: 200,
      message: "Assignment removed",
      data: res.rows[0],
    };
  } catch (err) {
    return handleError(err);
  } finally {
    client.release();
  }
};

const getAssignedUsers = async (taskId) => {
  const client = await connectDB();

  const query = `
    SELECT u.user_id, u.name, u.email
    FROM task_assignments ta
    JOIN users u ON ta.user_id = u.user_id
    WHERE ta.task_id = $1
  `;

  try {
    const res = await client.query(query, [parseInt(taskId)]);
    return {
      success: true,
      status: 200,
      data: res.rows,
    };
  } catch (err) {
    return handleError(err);
  } finally {
    client.release();
  }
};

const getAllAssignmentsByProject = async (projectId) => {
  const client = await connectDB();

  const query = `
    SELECT 
      ta.task_id,
      ta.user_id,
      u.name AS user_name,
      u.email AS user_email
    FROM task_assignments ta
    JOIN tasks t ON ta.task_id = t.task_id
    JOIN users u ON ta.user_id = u.user_id
    WHERE t.project_id = $1
    ORDER BY ta.task_id, u.name;
  `;

  try {
    const res = await client.query(query, [parseInt(projectId)]);
    return {
      success: true,
      status: 200,
      data: res.rows,
    };
  } catch (err) {
    return handleError(err);
  } finally {
    client.release();
  }
};

module.exports = {
  assignUserToTask,
  removeUserFromTask,
  getAssignedUsers,
  getAllAssignmentsByProject,
};
