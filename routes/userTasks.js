const express = require("express");
const router = express.Router();
const { getTasksByUserId } = require("../models/userTasks");

// GET /tasks/user/:user_id — Get all tasks for a specific user
router.get("/user/:user_id", async (req, res) => {
  const userId = parseInt(req.params.user_id);
  if (isNaN(userId))
    return res
      .status(400)
      .send({ success: false, message: "Invalid user ID." });

  const data = await getTasksByUserId(userId);
  res.status(data.status).send(data);
});

module.exports = router;
