// server/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/db");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import route files
const contactRoutes = require("./routes/contactRoutes");
const bonCardRoutes = require("./routes/bonCardRoutes");
const userRoutes = require("./routes/userRoutes"); // Fixed declaration
const courseRoutes = require("./routes/courseRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

// Import relations initializer
const initializeRelations = require("./models/Relations");

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
app.use("/api/categories", categoryRoutes);

// Enhanced Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle specific types of errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: 'Duplicate entry not allowed',
      details: err.errors[0]?.message
    });
  }
  
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.errors[0]?.message
    });
  }

  // Default error response
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database relations
    console.log('Initializing database relations...');
    initializeRelations();

    // Reset foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Sync database with { alter: true }
    console.log('Syncing database...');
    await sequelize.sync({ alter: true });

    // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Database synced and altered successfully');

    // Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

  } catch (error) {
    console.error('Server initialization failed:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  // Don't exit the process in production
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

// Start the server
startServer();

module.exports = app; // Export for testing purposes