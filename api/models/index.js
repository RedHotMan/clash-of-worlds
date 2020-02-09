const sequelize = require("../dbConnect");

const models = {
  User: sequelize.import("./user"),
  Planet: sequelize.import("./planet")
};

models.Planet.hasMany(models.User);

module.exports = models;
