// routes/fetchCollabProjects.js
const express = require("express");
const router = express.Router();
const { getProjectsByUser } = require("../models/fetchCollabProjects");

// ✅ GET all projects a user is collaborating on
router.get("/:user_id", async (req, res) => {
  const userId = parseInt(req.params.user_id);

  if (isNaN(userId)) {
    return res.status(400).send({ success: false, message: "Invalid user ID" });
  }

  try {
    const result = await getProjectsByUser(userId);
    return res.status(result.status).send(result);
  } catch (err) {
    console.error("Error fetching projects for user:", err);
    return res.status(500).send({ success: false, message: "Server error" });
  }
});

module.exports = router;
