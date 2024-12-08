const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Define BonCard Model
const BonCard = sequelize.define('BonCard', {
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
    type: DataTypes.TEXT,
  },
  image: {
    type: DataTypes.STRING,
  },
  expirationDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, { timestamps: true });

// Relations
BonCard.belongsTo(User, { foreignKey: 'userId' });

module.exports = BonCard;
