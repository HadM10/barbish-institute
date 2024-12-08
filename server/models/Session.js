const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Course = require('./Course');
const User = require('./User');

const Session = sequelize.define('Session', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  courseId: {
    type: DataTypes.INTEGER,
    references: {
      model: Course,
      key: 'id',
    },
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  duration: {
    type: DataTypes.INTEGER, // Duration in minutes
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Define relationships
Course.hasMany(Session, { foreignKey: 'courseId' });
Session.belongsTo(Course, { foreignKey: 'courseId' });

// Optional: Many-to-Many for Session access
Session.belongsToMany(User, { through: 'SessionAccess', foreignKey: 'sessionId' });
User.belongsToMany(Session, { through: 'SessionAccess', foreignKey: 'userId' });

module.exports = Session;
