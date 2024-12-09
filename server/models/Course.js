const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Session = sequelize.models.Session;

const Subscription = require('./Subscription');

// Define Course Model
const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING, // Path or URL for course image
    allowNull: true,        // Optional
  },
  description: {
    type: DataTypes.STRING, // Short description
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT, // Full course details or description
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER, // Duration in hours
  },
}, { timestamps: true });

// Relations
Course.hasMany(Session, {
  foreignKey: 'courseId',
  onDelete: 'CASCADE', // Automatically deletes sessions when a course is deleted
});
Session.belongsTo(Course, { foreignKey: 'courseId' });

Course.hasMany(Subscription, {
  foreignKey: 'courseId',
  onDelete: 'CASCADE', // Automatically deletes subscriptions when a course is deleted
});
Subscription.belongsTo(Course, { foreignKey: 'courseId' });

module.exports = Course;
