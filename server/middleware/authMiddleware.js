const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(200).json({
        status: 'success',
        data: []
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user info to request
    req.user = {
      id: decoded.userId
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(200).json({
      status: 'success',
      data: []
    });
  }
};

module.exports = authMiddleware; 