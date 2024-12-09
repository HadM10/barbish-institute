const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Session = require('./Session');
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
Course.hasMany(Session, { foreignKey: 'courseId', onDelete: 'CASCADE' });
Session.belongsTo(Course, { foreignKey: 'courseId' });

Course.belongsToMany(User, {
  through: Subscription,
  foreignKey: 'courseId',
  otherKey: 'userId',
});

User.belongsToMany(Course, {
  through: Subscription,
  foreignKey: 'userId',
  otherKey: 'courseId',
});

module.exports = Course;
