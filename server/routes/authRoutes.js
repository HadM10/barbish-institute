// /routes/authRoutes.js
const express = require("express");
const { login } = require("../controllers/authController"); // Import the controller

const router = express.Router();

// POST /login route for user login
router.post("/", login);

module.exports = router;
