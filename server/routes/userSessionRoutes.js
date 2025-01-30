const express = require('express');
const router = express.Router();
const userSessionController = require('../controllers/userSessionController');
const auth = require('../middleware/auth');

router.post('/mark-watched', auth, userSessionController.markSessionAsWatched);
router.get('/progress/:userId/:courseId', auth, userSessionController.getSessionProgress);

module.exports = router; 