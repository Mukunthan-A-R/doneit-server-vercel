const express = require("express");
const router = express.Router();
const callOpenRouter = require("./callOpenRouter");

router.post("/:id", async (req, res) => {
  try {
    // console.log(req.body);
    // console.log(req.user.userId);

    const userId = req.user.userId;

    const result = await callOpenRouter(req.body, req.params.id, userId);
    res.status(200).json(result);
  } catch (err) {
    console.error("LLM Error:", err);
    res.status(500).json({ error: "LLM call failed" });
  }
});

module.exports = router;
