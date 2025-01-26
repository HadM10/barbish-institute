// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/db");
const compressionMiddleware = require("./middleware/compression");
const path = require("path");

// Import route files
const contactRoutes = require("./routes/contactRoutes");
const bonCardRoutes = require("./routes/bonCardRoutes");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");
const mostSubCoursesRoutes = require("./routes/mostSubCoursesRoutes");
const userSessionRoutes = require("./routes/userSessionRoutes");

// Import models
require("./models/Relations");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(compressionMiddleware);

// API Routes
app.use("/api/contact", contactRoutes);
app.use("/api/boncards", bonCardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/mostSubCourses", mostSubCoursesRoutes);
app.use("/api/user-sessions", userSessionRoutes);

// Serve static files from React app in production
if (process.env.NODE_ENV === "production") {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, "../client/build")));

  // API health check
  app.get("/api/health", (req, res) => {
    res.send("API is running...");
  });

  // Handle React routing, return all requests to React app
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Sync Database and Start Server
const PORT = process.env.PORT || 5000; // Added default port

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected");
    return sequelize.sync();
  })
  .then(() => {
    console.log("Database synced");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
