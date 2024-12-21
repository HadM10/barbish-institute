const express = require("express");
const router = express.Router(); // Use router directly
const courseController = require("../controllers/courseController");

// GET /courses - Get all courses
router.get("/", courseController.getAllCourses);

// GET /courses/:id - Get a course by ID
router.get("/:id", courseController.getCourseById);

// POST /courses - Create a new course
router.post("/", courseController.createCourse);

// PUT /courses/:id - Update a course by ID
router.put("/:id", courseController.updateCourse);

// DELETE /courses/:id - Delete a course by ID
router.delete("/:id", courseController.deleteCourse);

module.exports = router;