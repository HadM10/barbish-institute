const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure this path is correct

module.exports = async (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Debugging line
    console.log('Decoded Token:', decoded);

    // Ensure User model is correctly imported
    if (!User) {
      return res.status(500).json({ msg: 'User model not found' });
    }

    // Fetch user from the database
    const user = await User.findByPk(decoded.id); // Adjust if using a different method
    if (!user || !user.isApproved) {
      return res.status(403).json({ msg: 'Access denied: User not approved' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
