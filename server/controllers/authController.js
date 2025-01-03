const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// Login handler
const login = async (req, res) => {
  const { username, password } = req.body;

  // Check if the username and password match the ones in the .env file (Admin check)
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    // Admin credentials match, generate token with expiration
    const token = jwt.sign(
      { username, role: "admin" }, // Add 'role' as 'admin' for admin user
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Admins get token expiration (1 hour)
    );

    return res.json({
      status: "success",
      message: "Login successful",
      token,
      role: "admin",
    });
  }

  try {
    // Regular user credentials - check the database for users
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({
        status: "error", // Indicating failure
        message: "Invalid username or password",
      });
    }

    // Compare password for regular users
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error", // Indicating failure
        message: "Invalid username or password",
      });
    }

    // Generate JWT token for regular user without expiration (they will stay logged in until they log out)
    const token = jwt.sign(
      { id: user.id, username: user.username }, // Regular user doesn't need role
      process.env.JWT_SECRET
    );

    res.json({
      status: "success", // Indicating success
      message: "Login successful",
      token,
      role: "user", // Include 'user' role for regular users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error", // Indicating failure
      message: "Server error",
    });
  }
};

module.exports = { login };
