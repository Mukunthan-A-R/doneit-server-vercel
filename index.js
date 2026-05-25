const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authMiddleware = require("./middleware/authMiddleware");
const cookieParser = require("cookie-parser");

const app = express();

// ✅ Body parser
app.use(express.json());

app.use(cookieParser());

// ✅ CORS configuration to allow all origins
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5186",
    "https://doneitapp.netlify.app",
    "https://doneit.online",
  ],
  credentials: true,
  // methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  // allowedHeaders: ["Content-Type", "Authorization"],
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
const { loggerMiddleware } = require("./middleware/logger.js");
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

// ✅ Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
