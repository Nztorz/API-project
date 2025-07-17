'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "firstname", {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.addColumn("Users", "lastname", {
      type: Sequelize.STRING,
      allowNull: true
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "firstname");
    await queryInterface.removeColumn("Users", "lastname");
  }
};
