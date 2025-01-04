const express = require("express");
const router = express.Router();
const mostSubCoursesController = require("../controllers/mostSubCoursesController");

// GET /courses/most-subscribed - Get most subscribed courses
router.get("/", mostSubCoursesController.getMostSubCourses);

module.exports = router;
