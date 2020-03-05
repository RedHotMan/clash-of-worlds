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
        points: 2000,
        createdAt: moment().format(),
        updatedAt: moment().format()
      },
      {
        name: "RaccoonsOfAsgard",
        leaderId: "48bd03b3-0332-4ed0-b098-bc2da667081c",
        points: 3500,
        createdAt: moment().format(),
        updatedAt: moment().format()
      },
      {
        name: "DucksInvaders",
        leaderId: "26d16c57-1629-482b-a7d2-e8dab6097887",
        points: 2300,
        createdAt: moment().format(),
        updatedAt: moment().format()
      },
      {
        name: "SkizoCats",
        leaderId: "f0010344-8011-4f10-82d3-342ba671fb6f",
        points: 3210,
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

    await queryInterface.bulkInsert("challenges", [
      {
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Integer vitae justo eget magna fermentum iaculis eu non diam.",
        pointsInGame: 70,
        date: moment()
          .add(1, "days")
          .startOf("day")
          .format(),
        attackerId: planets[0][1].id,
        defenderId: planets[0][3].id,
        createdAt: moment().format(),
        updatedAt: moment().format()
      },
      {
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Integer vitae justo eget magna fermentum iaculis eu non diam.",
        pointsInGame: 100,
        date: moment()
          .add(4, "days")
          .startOf("day")
          .format(),
        attackerId: planets[0][0].id,
        defenderId: planets[0][1].id,
        createdAt: moment().format(),
        updatedAt: moment().format()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
    await queryInterface.bulkDelete("planets", null, {});
    await queryInterface.bulkDelete("challenges", null, {});
  }
};
