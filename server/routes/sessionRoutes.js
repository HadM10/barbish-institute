const express = require("express");
const sessionController = require("../controllers/sessionController");

const router = express.Router();

// GET /sessions - Get all sessions
router.get("/", sessionController.getAllSessions);

// GET /sessions/:id - Get a session by ID
router.get("/:id", sessionController.getSessionById);

// POST /sessions - Create a new session
router.post("/", sessionController.createSession);

// PUT /sessions/:id - Update a session
router.put("/:id", sessionController.updateSession);

// DELETE /sessions/:id - Delete a session
router.delete("/:id", sessionController.deleteSession);

module.exports = router;