const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User'); // Correctly importing User model
const Course = require('./Course'); // Correctly importing Course model

// Define Subscription Model
const Subscription = sequelize.define('Subscription', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, { timestamps: true });

// Define relationships
Subscription.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
Subscription.belongsTo(Course, { foreignKey: 'courseId', onDelete: 'CASCADE' });

// Export the model
module.exports = Subscription;
