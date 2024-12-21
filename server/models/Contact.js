// server/models/Contact.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

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
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('unread', 'read'),
    defaultValue: 'unread',
  },
  replied: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  replyMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, { 
  timestamps: true 
});

module.exports = ContactUs;