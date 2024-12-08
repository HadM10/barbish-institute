const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Define ContactUs Model
const ContactUs = sequelize.define('ContactUs', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isResponded: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, { timestamps: true });

// Relations (Optional)
ContactUs.belongsTo(User, { foreignKey: 'userId' });

module.exports = ContactUs;
