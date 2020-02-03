const sequelize = require("../dbConnect");

const models = {
  User: sequelize.import('./user'),
};

module.exports = models;
