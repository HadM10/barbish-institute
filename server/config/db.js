const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

let sequelize;

if (process.env.JAWSDB_URL) {
  // Production with JawsDB
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  // Local development
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: "mysql",
      port: process.env.DB_PORT,
    }
  );
}

// Sync all models with the database
sequelize
  .sync()
  .then(() => {
    console.log("Database & tables updated");
  })
  .catch((err) => {
    console.error("Error updating database:", err);
  });

module.exports = sequelize;
