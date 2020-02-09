const sequelize = require("../dbConnect");

const models = {
  User: sequelize.import("./user"),
  Planet: sequelize.import("./planet")
};

module.exports = models;
