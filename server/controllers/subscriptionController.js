const Subscription = require("../models/Subscription");
const User = require("../models/User");
const Course = require("../models/Course");

// Get all subscriptions 
exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll({
      include: [User, Course],
      attributes: ['id', 'userId', 'courseId', 'startDate', 'endDate', 'amount', 'isActive', 'createdAt', 'updatedAt']
    });
    res.status(200).send(subscriptions);
  } catch (error) {
    res.status(500).send({
      error: "Error fetching subscriptions",
      details: error.message,
    });
  }
};

// Get a subscription by ID 
exports.getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findByPk(req.params.id, {
      include: [User, Course], // Include related User and Course models 
    });
    if (!subscription)
      return res.status(404).send({
        error: "Subscription not found",
      });

    res.status(200).send(subscription);
  } catch (error) {
    res.status(500).send({
      error: "Error fetching subscription",
      details: error.message,
    });
  }
};

// Create a new subscription 
exports.createSubscription = async (req, res) => {
  try {
    const { userId, courseId, startDate, endDate, amount, isActive } = req.body;

    // Create subscription with amount
    const newSubscription = await Subscription.create({
      userId,
      courseId,
      startDate,
      endDate,
      amount: Number(amount), // Explicitly convert amount to number
      isActive
    });

    // Fetch the complete subscription with associations
    const completeSubscription = await Subscription.findByPk(newSubscription.id, {
      include: [User, Course]
    });

    res.status(201).send(completeSubscription);
  } catch (error) {
    res.status(500).send({
      error: "Error creating subscription",
      details: error.message,
    });
  }
};

// Update a subscription by ID  
exports.updateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByPk(req.params.id);
    if (!subscription) {
      return res.status(404).send({
        error: "Subscription not found",
      });
    }

    // If amount is included in the update, ensure it's a number
    if (req.body.amount !== undefined) {
      req.body.amount = Number(req.body.amount);
    }

    const updatedSubscription = await subscription.update(req.body);
    res.status(200).send(updatedSubscription);
  } catch (error) {
    res.status(500).send({
      error: "Error updating subscription",
      details: error.message,
    });
  }
};

// Delete a subscription by ID  
exports.deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByPk(req.params.id);
    if (!subscription)
      return res.status(404).send({
        error: "Subscription not found",
      });

    await subscription.destroy();
    res.status(200).send({
      message: "Subscription deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      error: "Error deleting subscription",
      details: error.message,
    });
  }
};
