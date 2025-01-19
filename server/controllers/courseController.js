const Course = require("../models/Course");
const Category = require("../models/Category");
const sequelize = require("../config/db");
const { uploadImage } = require("../utils/azureStorage");
const upload = require("../middleware/uploadMiddleware");

// Add this middleware configuration
exports.uploadFields = upload.fields([{ name: "image", maxCount: 1 }]);

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [Category], // Include related User and Course models
    });
    res.status(200).send(courses);
  } catch (error) {
    res.status(500).send({
      error: "Error fetching courses",
      details: error.message,
    });
  }
};

// Get a course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).send({ error: "Course not found" });
    }

    res.status(200).send(course);
  } catch (error) {
    res.status(500).send({
      error: "Error fetching course",
      details: error.message,
    });
  }
};

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    let imageUrl = null;

    // Add this image upload handling
    if (req.files && req.files.image) {
      imageUrl = await uploadImage(req.files.image[0]);
    }

    const newCourse = await Course.create({
      title: req.body.title,
      image: imageUrl || req.body.image, // Use uploaded image URL or provided URL
      description: req.body.description,
      content: req.body.content,
      price: req.body.price,
      duration: req.body.duration,
      instructor: req.body.instructor,
      categoryId: req.body.categoryId,
    });

    res.status(201).send(newCourse);
  } catch (error) {
    res.status(500).send({
      error: "Error creating course",
      details: error.message,
    });
  }
};

// Update a course by ID
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).send({ error: "Course not found" });
    }

    // Add this image upload handling
    let imageUrl = course.image;
    if (req.files && req.files.image) {
      imageUrl = await uploadImage(req.files.image[0]);
    }

    const updatedCourse = await course.update({
      ...req.body,
      image: imageUrl || req.body.image,
    });

    res.status(200).send(updatedCourse);
  } catch (error) {
    res.status(500).send({
      error: "Error updating course",
      details: error.message,
    });
  }
};

// Delete a course by ID
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).send({ error: "Course not found" });
    }

    await course.destroy();
    res.status(200).send({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).send({
      error: "Error deleting course",
      details: error.message,
    });
  }
};
