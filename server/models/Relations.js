const Category = require("./Category");
const Course = require("./Course");
const Session = require("./Session");
const User = require("./User");
const Subscription = require("./Subscription");
const Bonus = require("./BonCard");
const Contact = require("./Contact");
const UserSession = require("../models/UserSession");

// Defining Relations

// Each session belongs to one course
Session.belongsTo(Course, { foreignKey: "courseId" });
Course.hasMany(Session, { foreignKey: "courseId", onDelete: "CASCADE" });

// A user can have many courses through subscriptions, and a course can have many users
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

// A subscription belongs to both a user and a course
Subscription.belongsTo(User, { foreignKey: "userId" });
Subscription.belongsTo(Course, { foreignKey: "courseId" });

// User can have many sessions, and sessions can belong to many users (via UserSession)
User.belongsToMany(Session, { through: UserSession, foreignKey: "userId" });
Session.belongsToMany(User, { through: UserSession, foreignKey: "sessionId" });

// Course belongs to a category, and each category can have many courses
Course.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasMany(Course, { foreignKey: "categoryId" });

// Add any other relationships as needed
module.exports = () => {}; // Just export a function to call it after all models are loaded
