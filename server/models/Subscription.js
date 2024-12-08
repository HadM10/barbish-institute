const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

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

// Relations
Subscription.belongsTo(User, { foreignKey: 'userId' });
Subscription.belongsTo(Course, { foreignKey: 'courseId' });

module.exports = Subscription;
