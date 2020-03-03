const moment = require("moment");
const bcrypt = require("bcrypt");

("use strict");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("users", [
      {
        id: "ac2a4eec-2996-48c6-94c3-fe328b279e17",
        username: "admin",
        email: "admin@email.com",
        password: await bcrypt.hash("admin", 12),
        createdAt: moment().format(),
        updatedAt: moment().format()
      },
      {
        id: "13dc1e5c-eb36-4919-9f8f-4978019dd127",
        username: "Broly",
        email: "broly@email.com",
        password: await bcrypt.hash("psswrd", 12),
        createdAt: moment().format(),
        updatedAt: moment().format()
      },
      {
        id: "48bd03b3-0332-4ed0-b098-bc2da667081c",
        username: "Bejita",
        email: "bejita@email.com",
        password: await bcrypt.hash("psswrd", 12),
        createdAt: moment().format(),
        updatedAt: moment().format()
      },
      {
        id: "26d16c57-1629-482b-a7d2-e8dab6097887",
        username: "Gohan",
        email: "gohan@email.com",
        password: await bcrypt.hash("psswrd", 12),
        createdAt: moment().format(),
        updatedAt: moment().format()
      },
      {
        id: "f0010344-8011-4f10-82d3-342ba671fb6f",
        username: "Goku",
        email: "goku@email.com",
        password: await bcrypt.hash("psswrd", 12),
        createdAt: moment().format(),
        updatedAt: moment().format()
      }
    ]);

    await queryInterface.bulkInsert("planets", [
      {
        name: "DonutsFactory",
        leaderId: "13dc1e5c-eb36-4919-9f8f-4978019dd127",
        createdAt: moment().format(),
        updatedAt: moment().format()
      },
      {
        name: "RaccoonsOfAsgard",
        leaderId: "48bd03b3-0332-4ed0-b098-bc2da667081c",
        createdAt: moment().format(),
        updatedAt: moment().format()
      },
      {
        name: "DucksInvaders",
        leaderId: "26d16c57-1629-482b-a7d2-e8dab6097887",
        createdAt: moment().format(),
        updatedAt: moment().format()
      },
      {
        name: "SkizoCats",
        leaderId: "f0010344-8011-4f10-82d3-342ba671fb6f",
        createdAt: moment().format(),
        updatedAt: moment().format()
      }
    ]);

    const planets = await queryInterface.sequelize.query(
      "SELECT * FROM planets"
    );

    await planets[0].forEach(async planet => {
      const res = await queryInterface.sequelize.query(
        `UPDATE users SET "planetId"='${planet.id}' WHERE id='${planet.leaderId}'`
      );
    });

    await queryInterface.sequelize.query("SELECT * FROM users");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
    await queryInterface.bulkDelete("planets", null, {});
  }
};
