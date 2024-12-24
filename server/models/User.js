   // server/models/User.js
   const { DataTypes } = require("sequelize");
   const sequelize = require("../config/db");

   const User = sequelize.define(
     "User",
     {
       id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
       },
       username: {
         type: DataTypes.STRING,
         allowNull: false,
         unique: true, // Ensure this is necessary
       },
       email: {
         type: DataTypes.STRING,
         allowNull: false,
         unique: true, // Ensure this is necessary
         validate: {
           isEmail: true,
         },
       },
       password: {
         type: DataTypes.STRING,
         allowNull: false,
       },
       isActive: {
         type: DataTypes.BOOLEAN,
         defaultValue: true,
       },
     },
     {
       timestamps: true,
       paranoid: true,
     }
   );

   module.exports = User;