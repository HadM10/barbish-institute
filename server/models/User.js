const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Subscription = require('./Subscription'); // Correct relation with Subscription
const Course = require('./Course'); // Correct relation with Course

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
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

// Establish relationships

// Many-to-many relationship between User and Course through Subscription
User.belongsToMany(Course, {
  through: Subscription,
  foreignKey: 'userId',
  otherKey: 'courseId',
});
Course.belongsToMany(User, {
  through: Subscription,
  foreignKey: 'courseId',
  otherKey: 'userId',
});

module.exports = User;
