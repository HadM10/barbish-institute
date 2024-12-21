// server/models/Relations.js
const Category = require("./Category");
const Course = require("./Course");
const Session = require("./Session");
const User = require("./User");
const Subscription = require("./Subscription");
const Bonus = require("./BonCard");
const Contact = require("./Contact");
const UserSession = require("./UserSession");

// Initialize relationships with explicit index names
const initializeRelations = () => {
  // Course and Session relationship
  Session.belongsTo(Course, { 
    foreignKey: "courseId",
    onDelete: "CASCADE",
    indexes: [{ name: 'session_course_idx' }]
  });
  
  Course.hasMany(Session, { 
    foreignKey: "courseId",
    onDelete: "CASCADE"
  });

  // User and Course relationship through Subscription
  Course.belongsToMany(User, {
    through: {
      model: Subscription,
      unique: false
    },
    foreignKey: "courseId",
    otherKey: "userId",
    indexes: [{ name: 'course_user_idx' }]
  });

  User.belongsToMany(Course, {
    through: {
      model: Subscription,
      unique: false
    },
    foreignKey: "userId",
    otherKey: "courseId",
    indexes: [{ name: 'user_course_idx' }]
  });

  // Subscription relationships
  Subscription.belongsTo(User, { 
    foreignKey: "userId",
    indexes: [{ name: 'subscription_user_idx' }]
  });
  
  Subscription.belongsTo(Course, { 
    foreignKey: "courseId",
    indexes: [{ name: 'subscription_course_idx' }]
  });

  // User and Session relationship through UserSession
  User.belongsToMany(Session, { 
    through: UserSession,
    foreignKey: "userId",
    indexes: [{ name: 'user_session_idx' }]
  });
  
  Session.belongsToMany(User, { 
    through: UserSession,
    foreignKey: "sessionId",
    indexes: [{ name: 'session_user_idx' }]
  });

  // Category and Course relationship
  Course.belongsTo(Category, { 
    foreignKey: "categoryId",
    indexes: [{ name: 'course_category_idx' }]
  });
  
  Category.hasMany(Course, { 
    foreignKey: "categoryId"
  });
};

// Export a function that initializes all relationships
module.exports = () => {
  try {
    initializeRelations();
    console.log('Database relations initialized successfully');
  } catch (error) {
    console.error('Error initializing database relations:', error);
    throw error;
  }
};