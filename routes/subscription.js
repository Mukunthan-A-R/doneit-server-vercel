const express = require("express");
const router = express.Router();
const { getSubscriptionByUserId } = require("../models/subscription");

router.get("/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);
  if (!userId) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  const result = await getSubscriptionByUserId(userId);
  return res.status(result.status).json(result);
});

module.exports = router;
