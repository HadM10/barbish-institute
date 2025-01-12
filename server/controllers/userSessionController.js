const UserSession = require('../models/UserSession');
const Session = require('../models/Session');

exports.markSessionAsWatched = async (req, res) => {
  try {
    const { userId, sessionId } = req.body;

    console.log('Marking session as watched:', { userId, sessionId });

    const [userSession, created] = await UserSession.findOrCreate({
      where: { userId, sessionId },
      defaults: {
        isWatched: true,
        watchedAt: new Date()
      }
    });

    if (!created) {
      await userSession.update({
        isWatched: true,
        watchedAt: new Date()
      });
    }

    console.log('Session marked as watched:', userSession);

    res.status(200).json({
      status: 'success',
      data: userSession
    });
  } catch (error) {
    console.error('Error in markSessionAsWatched:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getSessionProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    
    // Get all sessions for the course
    const sessions = await Session.findAll({
      where: { courseId },
      raw: true
    });

    console.log('Found sessions:', sessions);

    // Get watched sessions for the user
    const watchedSessions = await UserSession.findAll({
      where: {
        userId,
        sessionId: sessions.map(s => s.id),
        isWatched: true
      },
      raw: true
    });

    console.log('Found watched sessions:', watchedSessions);

    const progress = {
      totalSessions: sessions.length,
      watchedSessions: watchedSessions.length,
      sessions: sessions.map(session => ({
        sessionId: session.id,
        title: session.title,
        isWatched: watchedSessions.some(ws => ws.sessionId === session.id)
      }))
    };

    console.log('Sending progress:', progress);

    res.status(200).json({
      status: 'success',
      data: progress
    });
  } catch (error) {
    console.error('Error in getSessionProgress:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}; 