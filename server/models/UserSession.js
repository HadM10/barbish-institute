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
    isWatched: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    watchedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: 'user_sessions',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'sessionId']
      }
    ]
  }
);

module.exports = UserSession;
