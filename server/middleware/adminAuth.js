const jwt = require("jsonwebtoken");

// Allows the request only with a valid admin JWT (issued by /api/auth/login).
module.exports = (req, res, next) => {
  const token =
    req.header("x-auth-token") ||
    (req.header("Authorization") || "").replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ success: false, message: "Not signed in" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admins only" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Session expired, sign in again" });
  }
};
