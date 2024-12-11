    const express = require("express");
    const {
    getAllSessions,
    getSessionById,
    createSession,
    updateSession,
    deleteSession,
    } = require("../controllers/sessionController");

    const router = express.Router();

    // GET /api/sessions - Get all sessions
    router.get("/sessions", getAllSessions);

    // GET /api/sessions/:id - Get a session by ID
    router.get("/sessions/:id", getSessionById);

    // POST /api/sessions - Create a new session
    router.post("/sessions", createSession);

    // PUT /api/sessions/:id - Update a session by ID
    router.put("/sessions/:id", updateSession);

    // DELETE /api/sessions/:id - Delete a session by ID
    router.delete("/sessions/:id", deleteSession);

    module.exports = router;
