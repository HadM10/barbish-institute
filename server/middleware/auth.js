const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Ensure this path is correct

module.exports = async (req, res, next) => {
  // Check for token in the 'x-auth-token' header
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify the JWT token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database using the decoded token's ID
    const user = await User.findByPk(decoded.id);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Attach the decoded user info to the request object for later use
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error("Token verification error:", err);

    // Send appropriate response if the token is invalid
    res.status(401).json({ msg: "Token is not valid" });
  }
};
