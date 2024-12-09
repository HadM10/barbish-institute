const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');


// Import models
const User = require('./User')(sequelize, DataTypes);
const Course = require('./Course')(sequelize, DataTypes);
const Session = require('./Session')(sequelize, DataTypes);
const Subscription = require('./Subscription')(sequelize, DataTypes);
const ContactUs = require('./Contact')(sequelize, DataTypes);
const BonCard = require('./Bonus')(sequelize, DataTypes);

// Define relationships
User.associate = (models) => {
  User.belongsToMany(models.Course, {
    through: models.Subscription,
    foreignKey: 'userId',
  });
};

Course.associate = (models) => {
  Course.hasMany(models.Session, { foreignKey: 'courseId' });
  Course.hasMany(models.Subscription, { foreignKey: 'courseId' });
};

Session.associate = (models) => {
  Session.belongsTo(models.Course, { foreignKey: 'courseId' });
};

Subscription.associate = (models) => {
  Subscription.belongsTo(models.User, { foreignKey: 'userId' });
  Subscription.belongsTo(models.Course, { foreignKey: 'courseId' });
};

// Export models and sequelize instance
const models = { User, Course, Session, Subscription, ContactUs, BonCard };
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});
module.exports = { sequelize, ...models };
