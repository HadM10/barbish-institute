const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Session = require("./Session");

// Define UserSession Model
const UserSession = sequelize.define(
  "UserSession",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { timestamps: true }
);

module.exports = UserSession;