const models = require("../../models");

const planetResolver = {
  Planet: {
    id: planet => planet.id,
    name: planet => planet.name,
    points: planet => planet.points,
    challengeCount: planet => planet.challengeCount,
    leader: async planet => {
      return await models.User.findByPk(planet.leaderId);
    }
  },
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
