const express = require("express");
const router = express.Router();
const { fetchTasksByProjectId } = require("../models/projectTasks");

router.get("/:id", async (req, res) => {
  const projectId = parseInt(req.params.id, 10);
  const userId = req.user.userId;

  const data = await fetchTasksByProjectId(userId, projectId);
  res.status(data.status).json(data);
});

module.exports = router;
