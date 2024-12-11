const express = require("express");
const {
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} = require('../controllers/subscriptionController');

const router = express.Router();

// GET /api/subscriptions - Get all subscriptions  
router.get("/subscriptions", getAllSubscriptions);

// GET /api/subscriptions/:id - Get a subscription by ID  
router.get("/subscriptions/:id", getSubscriptionById);

// POST /api/subscriptions - Create a new subscription  
router.post("/subscriptions", createSubscription);

// PUT /api/subscriptions/:id - Update a subscription by ID  
router.put("/subscriptions/:id", updateSubscription);

// DELETE /api/subscriptions/:id - Delete a subscription by ID  
router.delete("/subscriptions/:id", deleteSubscription);

module.exports = router;