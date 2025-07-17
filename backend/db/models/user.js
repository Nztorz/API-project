'use strict';
const {
  Model
} = require('sequelize');
const validator = require("validator");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Entry, { foreignKey: "userId" });
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        len: [4, 30],
        notEmpty: true,
        notEmail(value) {
          if(validator.isEmail(value)) {
            throw new Error("Invalid username, should not be email")
          }
        }
      }
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50],
        notEmpty: true,
        notEmail(value) {
          if(validator.isEmail(value)) {
            throw new Error("Invalid first name, should not be email")
          }
        }
      }
    },
    lastname: {
      type: DataTypes.STRING,
      validate: {
        len: [0, 50],
        notEmpty: false,
        notEmail(value) {
          if(validator.isEmail(value)) {
            throw new Error("Invalid last name, should not be email")
          }
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        len: [3, 256],
        isEmail: true
      }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: [
          "hashedPassword", 
          "updatedAt", 
          "email", 
          "createdAt"
        ]
      }
    }
  });
  return User;
};