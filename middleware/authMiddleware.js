// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

// You should keep this secret in your environment variables (.env)
const JWT_SECRET = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
  const cookies = req.cookies;
  const token = cookies["doneit-session"];

  if (!token) {
    return res.status(401).json({ message: "Invalid auth token" }); // <-- must return here
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Auth token Expired", reset: "true" }); // <-- must return here too
  }
}

module.exports = authMiddleware;
