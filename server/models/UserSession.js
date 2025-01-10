const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UserSession = sequelize.define(
  "UserSession",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sessionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    watchTime: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lastWatched: {
      type: DataTypes.DATE,
      defaultValue: null
    }
  },
  {
    tableName: 'user_sessions',
    timestamps: true
  }
);

module.exports = UserSession;
