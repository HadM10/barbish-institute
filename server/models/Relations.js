const Category = require("./Category");
const Course = require("./Course");
const Session = require("./Session");
const User = require("./User");
const Subscription = require("./Subscription");
const Bonus = require("./Bonus");
const Contact = require("./Contact");
const UserSession = require("../models/UserSession");

// Defining Associations
Session.belongsTo(Course, { foreignKey: "courseId" });
Course.hasMany(Session, { foreignKey: "courseId", onDelete: "CASCADE" });

Course.belongsToMany(User, {
  through: Subscription,
  foreignKey: "courseId",
  otherKey: "userId",
});

User.belongsToMany(Course, {
  through: Subscription,
  foreignKey: "userId",
  otherKey: "courseId",
});

Subscription.belongsTo(User, { foreignKey: "userId" });
Subscription.belongsTo(Course, { foreignKey: "courseId" });

// User Session Status
User.belongsToMany(Session, { through: UserSession, foreignKey: "userId" });
Session.belongsToMany(User, { through: UserSession, foreignKey: "sessionId" });

Course.belongsTo(Category, { foreignKey: "categoryId" }); // Each course belongs to a category
Category.hasMany(Course, { foreignKey: "categoryId" }); // A category can have many courses

// Add other associations as needed
module.exports = () => {}; // Just export a function to call it after all models are loaded
