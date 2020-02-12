const sequelize = require("../dbConnect");

const models = {
  User: sequelize.import("./user"),
  Planet: sequelize.import("./planet"),
  Challenge: sequelize.import("./challenge")
};

models.Planet.hasMany(models.User);
models.Planet.belongsTo(models.User, { as: "leader", constraints: false });

module.exports = models;
