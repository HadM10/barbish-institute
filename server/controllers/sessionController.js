// controllers/sessionController.js
const Session = require("../models/Session");
const Course = require("../models/Course");
const { uploadVideo } = require("../utils/azureStorage");
const upload = require("../middleware/uploadMiddleware");

// Get all sessions
exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.findAll({
      include: [Course],
    });
    res.status(200).send(sessions);
  } catch (error) {
    res
      .status(500)
      .send({ error: "Error fetching sessions", details: error.message });
  }
};

// Get a session by ID
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findByPk(req.params.id, {
      include: [Course],
    });
    if (!session) {
      return res.status(404).send({ error: "Session not found" });
    }
    res.status(200).send(session);
  } catch (error) {
    res
      .status(500)
      .send({ error: "Error fetching session", details: error.message });
  }
};

// Create a new session
exports.createSession = async (req, res) => {
  try {
    const newSession = await Session.create({
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      duration: req.body.duration,
      videoUrl: req.body.videoUrl,
      courseId: req.body.courseId,
    });

    res.status(201).send(newSession);
  } catch (error) {
    res.status(500).send({
      error: "Error creating session",
      details: error.message,
    });
  }
};

// Update a session
exports.updateSession = async (req, res) => {
  try {
    console.log('Update request received:', {
      id: req.params.id,
      body: req.body
    });

    const session = await Session.findByPk(req.params.id);
    if (!session) {
      console.log('Session not found:', req.params.id);
      return res.status(404).send({ error: "Session not found" });
    }

    // Log current session state
    console.log('Current session state:', session.toJSON());

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      duration: req.body.duration,
      videoUrl: req.body.videoUrl,
      courseId: req.body.courseId,
    };

    console.log('Updating with data:', updateData);

    const updatedSession = await session.update(updateData);
    
    // Log updated session state
    console.log('Updated session state:', updatedSession.toJSON());

    // Fetch fresh session data with Course information
    const refreshedSession = await Session.findByPk(req.params.id, {
      include: [Course],
    });
    
    res.status(200).send(refreshedSession);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).send({ 
      error: "Error updating session", 
      details: error.message 
    });
  }
};

// Delete a session
exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findByPk(req.params.id);
    if (!session) {
      return res.status(404).send({ error: "Session not found" });
    }
    await session.destroy();
    res.status(200).send({ message: "Session deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ error: "Error deleting session", details: error.message });
  }
};