const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Course = require('./Course');

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
    references: {
      model: Course, // Refers to Course model
      key: 'id',
    },
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
    type: DataTypes.STRING, // URL or path for the session video
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, { timestamps: true });

// Define relationship
Session.belongsTo(Course, { foreignKey: 'courseId'});
Course.hasMany(Session, { foreignKey: 'courseId', onDelete: 'CASCADE'}); // Ensures bidirectional association

// Export the model
module.exports = Session;
