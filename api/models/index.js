const sequelize = require("../dbConnect");

const models = {
  User: sequelize.import("./user"),
  Planet: sequelize.import("./planet"),
  Challenge: sequelize.import("./challenge")
};

models.Planet.hasMany(models.User);
models.Planet.belongsTo(models.User, { as: "leader", constraints: false });

models.Planet.belongsToMany(models.Planet, {
  as: "attacker",
  through: "challenge",
  foreignKey: "attackerId"
});

models.Planet.belongsToMany(models.Planet, {
  as: "defender",
  through: "challenge",
  foreignKey: "defenderId"
});

module.exports = models;
