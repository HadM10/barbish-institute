// server/config/db.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME, // Database name from .env
  process.env.DB_USER, // Username from .env
  process.env.DB_PASSWORD, // Password from .env
  {
    host: process.env.DB_HOST, // Database host from .env
    dialect: 'mysql', // Change this to 'postgres', 'sqlite', etc., if needed
  }
);

// Test connection
sequelize
  .authenticate()
  .then(() => console.log('Database connected successfully!'))
  .catch((err) => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
