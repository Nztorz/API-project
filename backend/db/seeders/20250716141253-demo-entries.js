'use strict';

/** @type {import('sequelize-cli').Migration} */

const options = { tableName: "Entries" }
if(process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(options.tableName, [
      {
        userId: 6,
        title: "Demo-lition Note",
      },
      {
        userId: 7,
        title: "A very large text to be very descriptive with what is in this note",
        description: `This is a new entry for the diary
        which we can write down our emotions and/or whatever
        cross our minds`,
        category: "Diary",
      },
      {
        userId: 7,
        title: `Becoming very active in diary notes`,
        description: `Since I can write whatever
        I'll make this easier`,
      },
      {
        userId: 8,
        title: `A title`,
        description: `- Eggs - Milk - Water`,
        category: "grocery",
      }

    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Entries";
    const Op = Sequelize.Op;
    return await queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [6, 7, 8]}
    }, {});
  }
};
