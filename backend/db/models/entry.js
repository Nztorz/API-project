'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Entry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Entry.belongsTo(models.User, { foreignKey: "userId"})
    }
  }
  Entry.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 250]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "general",
    },
  }, {
    sequelize,
    modelName: 'Entry',
    defaultScope: {
      attributes: {
        exclude: [
          "createdAt",
          "updatedAt",
          
        ]
      }
    }
  });
  return Entry;
};