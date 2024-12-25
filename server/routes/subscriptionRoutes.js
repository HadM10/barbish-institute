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
router.get("/", getAllSubscriptions);

// GET /api/subscriptions/:id - Get a subscription by ID  
router.get("/:id", getSubscriptionById);

// POST /api/subscriptions - Create a new subscription  
router.post("/", createSubscription);

// PUT /api/subscriptions/:id - Update a subscription by ID  
router.put("/:id", updateSubscription);

// DELETE /api/subscriptions/:id - Delete a subscription by ID  
router.delete("/:id", deleteSubscription);

module.exports = router;
