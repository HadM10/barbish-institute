const UserSession = require("../models/UserSession");
const Session = require("../models/Session");

exports.markSessionAsWatched = async (req, res) => {
  try {
    const { userId, sessionId, isWatched = true } = req.body;

    console.log("Updating session watch status:", {
      userId,
      sessionId,
      isWatched,
    });

    // Find or create the user session record
    const [userSession, created] = await UserSession.findOrCreate({
      where: { userId, sessionId },
      defaults: {
        isWatched: isWatched,
        watchedAt: isWatched ? new Date() : null,
      },
    });

    if (!created && userSession.isWatched !== isWatched) {
      // Update only if there's a change
      await userSession.update({
        isWatched: isWatched,
        watchedAt: isWatched ? new Date() : null,
      });
    }

    // Fetch the updated record
    const updatedSession = await UserSession.findOne({
      where: { userId, sessionId },
      raw: true,
    });

    console.log("Session status updated:", updatedSession);

    res.status(200).json({
      status: "success",
      data: updatedSession,
    });
  } catch (error) {
    console.error("Error in markSessionAsWatched:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getSessionProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    // Get all sessions for the course
    const sessions = await Session.findAll({
      where: { courseId },
      attributes: ["id", "title", "courseId"],
      raw: true,
    });

    console.log("Found sessions for course:", {
      courseId,
      count: sessions.length,
    });

    // Get all user sessions (both watched and unwatched)
    const userSessions = await UserSession.findAll({
      where: {
        userId,
        sessionId: sessions.map((s) => s.id),
      },
      raw: true,
    });

    console.log("Found user sessions:", { count: userSessions.length });

    // Count watched sessions
    const watchedCount = userSessions.filter((us) => us.isWatched).length;

    const progress = {
      totalSessions: sessions.length,
      watchedSessions: watchedCount,
      sessions: sessions.map((session) => {
        const userSession = userSessions.find(
          (us) => us.sessionId === session.id
        );
        return {
          sessionId: session.id,
          title: session.title,
          isWatched: userSession ? userSession.isWatched : false,
          watchedAt: userSession ? userSession.watchedAt : null,
        };
      }),
    };

    console.log("Sending progress data:", {
      courseId,
      totalSessions: progress.totalSessions,
      watchedSessions: progress.watchedSessions,
    });

    res.status(200).json({
      status: "success",
      data: progress,
    });
  } catch (error) {
    console.error("Error in getSessionProgress:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
