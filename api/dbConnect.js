const Sequelize = require("sequelize");

const sequelize = new Sequelize("clash_of_worlds", "root", "root", {
  host: "database",
  dialect: "postgres"
});

module.exports = sequelize;
