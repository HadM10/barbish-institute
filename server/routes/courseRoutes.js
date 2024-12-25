// routes/courseRoutes.js
const express = require("express");
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const router = express.Router();

// GET /courses - Get all courses
router.get("/", getAllCourses);

// GET /courses/:id - Get a course by ID
router.get("/:id", getCourseById);

// POST /courses - Create a new course
router.post("/", createCourse);

// PUT /courses/:id - Update a course by ID
router.put("/:id", updateCourse);

// DELETE /courses/:id - Delete a course by ID
router.delete("/:id", deleteCourse);

module.exports = router;
