const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const sequelize = require('./models/db');


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());


// Health Check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Sync Database and Start Server
sequelize
  .sync()
  .then(() => {
    console.log('Database synced');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error('Unable to sync the database:', err);
  });
