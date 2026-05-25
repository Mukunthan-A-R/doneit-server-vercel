const express = require("express");
const path = require("path");
const router = express.Router();

// GET /about - Serve the about page
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/about.html"));
});

module.exports = router;
