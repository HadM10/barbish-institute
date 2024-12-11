const Session = require("../models/Session");
const Course = require("../models/Course");

// Get all sessions
exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.findAll({
      include: [Course], // Include related Course model
    });
    
    res.status(200).send(sessions);
  } catch (error) {
    res.status(500).send({ error: "Error fetching sessions", details: error.message });
  }
};

// Get a session by ID
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findByPk(req.params.id, {
      include: [Course], // Include related Course model 
    });
    
    if (!session) {
      return res.status(404).send({ error: "Session not found" });
    }

    res.status(200).send(session);
  } catch (error) {
    res.status(500).send({ error: "Error fetching session", details: error.message });
  }
}

// Create a new session 
exports.createSession = async (req, res) => {
  try {
    const { title, description, content, duration, videoUrl, courseId } = req.body;

    const newSession = await Session.create({
      title,
      description,
      content,
      duration,
      videoUrl,
      courseId,
    });
    
    res.status(201).send(newSession);
  } catch (error) {
    res.status(500).send({ error: "Error creating session", details: error.message });
  }
}

// Update a session by ID 
exports.updateSession = async (req, res) => {
  try {
    const session = await Session.findByPk(req.params.id);
    
    if (!session) {
      return res.status(404).send({ error: "Session not found" });
    }

    const updatedSession = await session.update(req.body);
    res.status(200).send(updatedSession);
    
  } catch (error) {
    res.status(500).send({ error: "Error updating session", details: error.message });
  }
}

// Delete a session by ID 
exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findByPk(req.params.id);
    
    if (!session) {
      return res.status(404).send({ error: "Session not found" });
    }

    await session.destroy();
    res.status(200).send({ message: "Session deleted successfully" });
    
  } catch (error) {
    res.status(500).send({ error: "Error deleting session", details: error.message });
  }
}