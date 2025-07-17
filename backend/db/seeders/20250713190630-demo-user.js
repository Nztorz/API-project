'use strict';
/** @type {import('sequelize-cli').Migration} */

const { User } = require("../models");
const bcrypt = require("bcryptjs");

const options = { tableName: "Users"};
if(process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(options.tableName, [
      {
        email: "demo@user.io",
        username: "Demo-lition",
        firstname: "Demolition",
        lastname: "Fernandez",
        hashedPassword: bcrypt.hashSync("password")
      },
      {
        email: "user1@user.io",
        username: "FakeUser1",
        firstname: "Johan",
        hashedPassword: bcrypt.hashSync("password2")
      },
      {
        email: "user2@user.io",
        username: "FakeUser2",
        firstname: "Maria",
        hashedPassword: bcrypt.hashSync("password3")
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ["Demo-lition", "FakeUser1", "FakeUser2"]}
    }, {});
  }
};
