const Subscription = require("../models/Subscription");
const User = require("../models/User");
const Course = require("../models/Course");

// Get all subscriptions 
exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll({
      include: [User, Course], // Include related User and Course models 
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
    const { userId, courseId, startDate, endDate } = req.body;

    const newSubscription = await Subscription.create({
      userId,
      courseId,
      startDate,
      endDate,
    });

    res.status(201).send(newSubscription);
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
    if (!subscription)
      return res.status(404).send({
        error: "Subscription not found",
      });

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
