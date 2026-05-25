const express = require("express");
const router = express.Router();

const {
  getActivityLogsByProject,
  createActivityLog,
} = require("../models/projectActivity");
const { getUser } = require("../models/users"); // your user model
const { hasProjectAccess } = require("../models/projectAccess");

// GET all activity logs for a project
router.get("/:projectId", async (req, res) => {
  const { projectId } = req.params;

  const sendResponse = (status, success, message, data = null) => ({
    status,
    success,
    message,
    data,
  });

  const accessGranted = await hasProjectAccess(req.user.userId, projectId);
  if (!accessGranted) {
    return res.status(403).json(sendResponse(403, false, "Access denied"));
  }

  const result = await getActivityLogsByProject(projectId);

  if (result.success) {
    res.status(200).json({ success: true, data: result.data });
  } else {
    res.status(500).json({ success: false, error: result.error });
  }
});

// POST new activity log
router.post("/", async (req, res) => {
  let { user_id, project_id, task_id, action, context } = req.body;

  if (!user_id || !project_id || !action) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields" });
  }

  // Fetch user to get name and email
  const userResult = await getUser(user_id);

  if (!userResult.success) {
    return res.status(404).json({ success: false, error: "User not found" });
  }

  const user = userResult.data;

  // Build description string automatically based on action & context
  let description = "";

  switch (action) {
    case "create":
      description = `Created task: "${context?.title || "Untitled Task"}" by ${
        user.name
      } <${user.email}>`;
      break;

    case "update":
      description = `Update on task "${context?.title || "Unknown Task"}" by ${
        user.name
      } <${user.email}>`;
      break;

    case "delete":
      description = `Deleted task: "${context?.title || "Unnamed Task"}" by ${
        user.name
      } <${user.email}>`;
      break;

    case "status-change":
      description = `Changed task status from "${context?.oldStatus}" to "${
        context?.newStatus
      }" for task "${context?.title || ""}" by ${user.name} <${user.email}>`;
      break;

    case "add-user":
      description = `Added user ${context?.addedUserName || "Unknown"} <${
        context?.addedUserEmail || "unknown@example.com"
      }> to the project by  ${user.name} <${user.email}>`;
      task_id = null;
      break;

    case "remove-user":
      description = `Removed user ${context?.targetUserName || "Unknown"} <${
        context?.targetUserEmail || "unknown@example.com"
      }> from the project by  ${user.name} <${user.email}>`;
      task_id = null;
      break;

    default:
      description = `Performed an unknown action by ${user.name} <${user.email}>`;
  }

  // Call model to insert log
  const createResult = await createActivityLog({
    user_id,
    project_id,
    task_id,
    action,
    description,
  });

  if (createResult.success) {
    res.status(201).json({ success: true, data: createResult.data });
  } else {
    res.status(500).json({ success: false, error: createResult.error });
  }
});

module.exports = router;
