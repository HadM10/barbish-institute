const express=require("express");
const router=require("express").Router();
const courseController=require("../controllers/courseController");

// GET /api/courses - Get all courses 
router.get("/courses",courseController.getAllCourses);

// GET /api/courses/:id - Get a course by ID 
router.get("/courses/:id",courseController.getCourseById);

// POST/api/courses - Create a new course 
router.post("/courses",courseController.createCourse);

// PUT/api/courses/:id - Update a course by ID 
router.put("/courses/:id",courseController.updateCourse);

// DELETE/api/courses/:id - Delete a course by ID 
router.delete("/courses/:id",courseController.deleteCourse);

module.exports= router; 