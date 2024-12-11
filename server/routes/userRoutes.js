const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// GET /api/users - Get all users
router.get("/users", userController.getAllUsers);

// GET /api/users/:id - Get a user by ID
router.get("/users/:id", userController.getUserById);

// POST /api/users - Create a new user
router.post("/users", userController.createUser);

// PUT /api/users/:id - Update a user by ID
router.put("/users/:id", userController.updateUser);

// DELETE /api/users/:id - Soft delete a user by ID
router.delete("/users/:id", userController.deleteUser);

module.exports = router;