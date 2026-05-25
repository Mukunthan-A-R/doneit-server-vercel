// routes/userEmail.js
const express = require("express");
const router = express.Router();
const { getUserByEmail } = require("../models/userEmail"); // Importing the model function to fetch user by email

// Get user by email
router.get("/:email", async (req, res) => {
  const email = req.params.email;
  const data = await getUserByEmail(email);

  if (data.success) {
    res.status(data.status).send(data);
  } else {
    res.status(data.status).send({
      message: data.message, // Sending the error message from the model
    });
  }
});

module.exports = router;
