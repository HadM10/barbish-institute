const express = require("express");
const { login, getUserCourses } = require("../controllers/authController");
const authMiddleware = require("../middleware/auth"); // Import auth middleware

const router = express.Router();

// Public route - no auth required
router.post("/", login);

// Protected route - requires valid JWT token
router.get("/my-courses", authMiddleware, getUserCourses);

module.exports = router;
