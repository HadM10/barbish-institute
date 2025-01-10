const UserSession = require('../models/UserSession');
const Session = require('../models/Session');
const { Op } = require('sequelize');
const sequelize = require('../config/db');

exports.getAllProgress = async (req, res) => {
  try {
    console.log('Request received:', {
      user: req.user,
      query: req.query
    });

    const userId = req.user?.id;
    if (!userId) {
      console.log('No user ID found');
      return res.status(200).json({
        status: 'success',
        data: []
      });
    }

    const { sessionIds } = req.query;
    console.log('Session IDs received:', sessionIds);

    if (!sessionIds) {
      console.log('No session IDs provided');
      return res.status(200).json({
        status: 'success',
        data: []
      });
    }

    // Parse and validate sessionIds
    const validSessionIds = sessionIds.split(',')
      .map(id => parseInt(id))
      .filter(id => !isNaN(id));

    console.log('Valid session IDs:', validSessionIds);

    if (validSessionIds.length === 0) {
      console.log('No valid session IDs found');
      return res.status(200).json({
        status: 'success',
        data: []
      });
    }

    // Find all user sessions
    const userSessions = await UserSession.findAll({
      where: {
        userId,
        sessionId: {
          [Op.in]: validSessionIds
        }
      },
      attributes: ['sessionId', 'completed', 'watchTime', 'lastWatched'],
      raw: true
    }).catch(err => {
      console.error('Database query error:', err);
      return [];
    });

    console.log('Found user sessions:', userSessions);

    // Create a map of existing progress
    const progressMap = {};
    validSessionIds.forEach(sessionId => {
      progressMap[sessionId] = {
        sessionId,
        completed: false,
        watchTime: 0,
        lastWatched: null
      };
    });

    // Update with actual progress where it exists
    userSessions.forEach(session => {
      if (session && session.sessionId) {
        progressMap[session.sessionId] = {
          sessionId: session.sessionId,
          completed: Boolean(session.completed),
          watchTime: session.watchTime || 0,
          lastWatched: session.lastWatched
        };
      }
    });

    const result = {
      status: 'success',
      data: Object.values(progressMap)
    };

    console.log('Sending response:', result);

    res.status(200).json(result);

  } catch (error) {
    console.error('Error in getAllProgress:', {
      error: error.message,
      stack: error.stack
    });
    
    res.status(200).json({
      status: 'success',
      data: []
    });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    const userSession = await UserSession.findOne({
      where: { userId, sessionId },
      attributes: ['sessionId', 'completed', 'watchTime', 'lastWatched']
    });

    res.status(200).json({
      status: 'success',
      data: userSession || { 
        sessionId,
        completed: false, 
        watchTime: 0,
        lastWatched: null
      }
    });
  } catch (error) {
    console.error('Error in getProgress:', error);
    res.status(200).json({
      status: 'success',
      data: { 
        sessionId: req.params.sessionId,
        completed: false, 
        watchTime: 0,
        lastWatched: null
      }
    });
  }
};

exports.updateProgress = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;
    const { completed, watchTime } = req.body;

    let userSession = await UserSession.findOne({
      where: { userId, sessionId }
    });

    if (userSession) {
      userSession.completed = completed;
      userSession.watchTime = watchTime;
      userSession.lastWatched = new Date();
      await userSession.save({ transaction });
    } else {
      userSession = await UserSession.create({
        userId,
        sessionId,
        completed,
        watchTime,
        lastWatched: new Date()
      }, { transaction });
    }

    await transaction.commit();

    res.status(200).json({
      status: 'success',
      data: {
        sessionId: userSession.sessionId,
        completed: userSession.completed,
        watchTime: userSession.watchTime,
        lastWatched: userSession.lastWatched
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error in updateProgress:', error);
    res.status(200).json({
      status: 'success',
      data: {
        sessionId: req.params.sessionId,
        completed: false,
        watchTime: 0,
        lastWatched: null
      }
    });
  }
};