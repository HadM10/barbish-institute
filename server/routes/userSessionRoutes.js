const express = require('express');
const router = express.Router();
const userSessionController = require('../controllers/userSessionController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get progress for multiple sessions
router.get('/progress', userSessionController.getAllProgress);

// Get progress for a single session
router.get('/:sessionId/progress', userSessionController.getProgress);

// Update progress for a session
router.post('/:sessionId/progress', userSessionController.updateProgress);

module.exports = router; 