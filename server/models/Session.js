// models/Session.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Session = sequelize.define(
  "Session",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
      type: DataTypes.INTEGER,
    },
    videoUrl: {
      type: DataTypes.STRING,
    },
    
  },
  { timestamps: true }
);

module.exports = Session;