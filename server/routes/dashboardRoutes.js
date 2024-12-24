// server/routes/statsRoutes.js
const express = require("express");
const { getStats } = require("../controllers/dashboardController");

const router = express.Router();

// Route to get the dashboard stats
router.get("/", getStats);

module.exports = router;
