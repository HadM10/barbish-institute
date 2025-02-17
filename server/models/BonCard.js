const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const BonCard = sequelize.define(
  "BonCard",
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
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING, // Assuming image URL or path will be stored.
      allowNull: true, // Image is optional.
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING, // Assuming link URL will be stored.
      allowNull: false, // Link is optional.
    },
    expiredDate: {
      type: DataTypes.DATE,
      allowNull: true, // The expiration date is optional but can be set if available.
    },
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt`
  }
);

module.exports = BonCard;
