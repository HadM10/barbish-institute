const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Subscription = require('./Subscription'); // Relation with Subscription
const Course = require('./Course'); // Relation with Course

const User = sequelize.define(
  'User',
  {
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
      validate: {
        isEmail: true, // Ensures valid email format
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true, // Automatically manages `createdAt` and `updatedAt`
    paranoid: true, // Enables `deletedAt` column for soft deletes
  }
);

// Establish relationships

// Many-to-many relationship between User and Course through Subscription
User.belongsToMany(Course, {
  through: Subscription,
  foreignKey: 'userId',
  otherKey: 'courseId',
  onDelete: 'CASCADE', // Cascades deletions through the junction table
});
Course.belongsToMany(User, {
  through: Subscription,
  foreignKey: 'courseId',
  otherKey: 'userId',
  onDelete: 'CASCADE',
});

module.exports = User;
