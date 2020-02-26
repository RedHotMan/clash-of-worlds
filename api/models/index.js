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
  through: {
    model: models.Challenge,
    unique: false
  },
  foreignKey: "attackerId"
});

models.Planet.belongsToMany(models.Planet, {
  as: "defender",
  through: {
    model: models.Challenge,
    unique: false
  },
  foreignKey: "defenderId"
});

module.exports = models;
