const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    // Check for token in both headers for flexibility
    const token =
      req.header("x-auth-token") ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "No token, authorization denied",
      });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from database
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Check if user is active (optional, if you have an active status)
    if (user.isActive === false) {
      return res.status(401).json({
        status: "error",
        message: "User account is deactivated",
      });
    }

    // Attach both decoded token and user object to request
    req.user = decoded;
    req.userDetails = user; // Full user object from database

    next();
  } catch (err) {
    console.error("Authentication error:", err);

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "error",
        message: "Invalid token",
      });
    }

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        message: "Token has expired",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Server authentication error",
    });
  }
};
