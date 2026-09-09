const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const authMiddleware = require("./middleware/authMiddleware");
const { loggerMiddleware } = require("./middleware/logger.js");

const app = express();

// ✅ Body parser
app.use(express.json());
app.use(cookieParser());

// ✅ CORS configuration to allow all origins
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://doneitweb.netlify.app",
    "https://doneit-server-vercel-e5yreh3l4-doneit-s-projects.vercel.app",
    "https://doneit-server-vercel.vercel.app",
    "http://localhost:5186",
    "https://doneitapp.netlify.app",
    "https://doneit.online",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

// ✅ Apply CORS middleware globally
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ✅ Middleware and Routes
const task = require("./routes/tasks");
const projectTasks = require("./routes/projectTasks");
const userProjects = require("./routes/userProjects");
const user = require("./routes/users");
const project = require("./routes/projects");
const userTasksRoute = require("./routes/userTasks");
const auth = require("./middleware/auth");
const authentication = require("./middleware/authentication");
const projectCollabRoutes = require("./routes/projectCollab");
const fetchCollabProjects = require("./routes/fetchCollabProjects");
const userEmailRoute = require("./routes/userEmail");
const passwordReset = require("./routes/passwordReset.js");
const userPasswordRoute = require("./routes/userPassword");
const projectActivityRoutes = require("./routes/projectActivity");
const taskAssignmentRoutes = require("./routes/taskAssignments");
const usercontact = require("./routes/contact");
const subscriptionRoutes = require("./routes/subscription");
const aboutRoute = require("./routes/about");
const chatbotRoute = require("./chatbot/chatRoute.js");

// ✅ Route mounts
app.use("/", aboutRoute);
app.use("/api", authentication);
app.use("/api/register", auth);
app.use("/api/password-reset", passwordReset);
app.use("/api/contact", usercontact);
app.use(authMiddleware);
app.use(loggerMiddleware);

app.use("/api/project", project);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/ai-assistant", chatbotRoute);
app.use("/project", userProjects);
app.use("/api/task", task);
app.use("/api/tasks", projectTasks);
app.use("/api/task-assignments", taskAssignmentRoutes);
app.use("/api/user", user);
app.use("/api/usertasks", userTasksRoute);
app.use("/api/userEmail", userEmailRoute);
app.use("/api/collab", projectCollabRoutes);
app.use("/api/collab-projects", fetchCollabProjects);
app.use("/api/user-password", userPasswordRoute);
app.use("/api/project-activity", projectActivityRoutes);

// Optional: Default root landing for health check
app.get("/", (req, res) => {
  res.send("🚀 DoneIt Serverless API is running smoothly!");
});

// 🛠️ FIX 3: Only spin up the listener if running locally. Vercel ignores this block.
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 Local Server running on port ${port}`);
  });
}

// 🛠️ CRITICAL: Export the app module for Vercel's serverless handler
module.exports = app;
