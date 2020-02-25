const models = require("../../models");

const planetResolver = {
  Query: {
    planets: async () => {
      return await models.Planet.findAll();
    },
    planet: async (_, { id }) => {
      return await models.Planet.findByPk(id);
    }
  }
};

module.exports = planetResolver;
