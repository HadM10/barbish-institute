const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Define Session Model
const Session = sequelize.define('Session', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  content: {
    type: DataTypes.TEXT,
  },
  duration: {
    type: DataTypes.INTEGER, // Duration in minutes
  },
  videoUrl: {
    type: DataTypes.STRING,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, { timestamps: true });

// Relations
Session.belongsTo(Course, { foreignKey: 'courseId' });

module.exports = Session;