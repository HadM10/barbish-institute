// server/routes/contactRoutes.js
const express = require('express');
const { 
  createContact, 
  getAllContacts, 
  getContactById,
  updateContactStatus,
  replyToContact,
  deleteContact
} = require('../controllers/contactController');

// Initialize router
const router = express.Router();

// Public routes
router.post("/", createContact);

// Protected routes (you can add auth middleware later)
router.get("/", getAllContacts);
router.get("/:id", getContactById);
router.patch("/:id/status", updateContactStatus);
router.post("/:id/reply", replyToContact);
router.delete("/:id", deleteContact);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('Route Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler for undefined routes
router.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Contact endpoint not found'
  });
});

module.exports = router;