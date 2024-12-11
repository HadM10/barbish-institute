const express = require("express");
const {
  getAllSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
} = require("../controllers/sessionController");

const router = express.Router();

// GET /sessions - Get all sessions
router.get("/", getAllSessions);

// GET /sessions/:id - Get a session by ID
router.get("/:id", getSessionById);

// POST /sessions - Create a new session
router.post("/", createSession);

// PUT /sessions/:id - Update a session by ID
router.put("/:id", updateSession);

// DELETE /sessions/:id - Delete a session by ID
router.delete("/:id", deleteSession);

module.exports = router;
