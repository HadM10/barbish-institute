const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/db");

// Import route files
const contactRoutes = require("./routes/contactRoutes");
const bonCardRoutes = require("./routes/bonCardRoutes");
userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const categoryRoutes = require("./routes/categoryRoutes"); // Assuming you have a category route

require("./models/Relations"); // Ensure relationships are loaded

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health Check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/api/contact", contactRoutes);
app.use("/api/boncards", bonCardRoutes);
app.use("/api/user", userRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/categories", categoryRoutes); // Added category routes

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Sync Database and Start Server
sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("Unable to sync the database:", err);
  });
