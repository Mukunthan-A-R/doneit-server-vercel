const express = require("express");
const router = express.Router();
const { getProjectsByCreator } = require("../models/useProject");

// ✅ GET projects by user ID (creator)
router.get("/:id", async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (isNaN(userId)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid project ID provided.",
    });
  }

  const data = await getProjectsByCreator(userId);
  res.status(data.status).json(data);
});

module.exports = router;
