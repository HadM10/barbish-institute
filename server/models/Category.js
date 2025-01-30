const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Define Category Model
const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = Category;
