const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// GET /api/:id - Get a user by ID
router.get("/:id", userController.getUserById);

// POST /api/ - Create a new user
router.post("/", userController.createUser);

// PUT /api/:id - Update a user by ID
router.put("/:id", userController.updateUser);

// DELETE /api/:id - Soft delete a user by ID
router.delete("/:id", userController.deleteUser);

// GET /api/ - Get all users
router.get("/", userController.getAllUsers);

module.exports = router;
