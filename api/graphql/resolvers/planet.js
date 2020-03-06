const models = require("../../models");

const planetResolver = {
  Planet: {
    id: planet => planet.id,
    name: planet => planet.name,
    points: planet => planet.points,
    leader: async (planet, _, context) => {
      return await context.userLoader.load(planet.leaderId);
    }
  },
  Query: {
    planets: async () => {
      return await models.Planet.findAll();
    },
    planet: async (_, { id }, context) => {
      return await context.planetLoader.load(id);
    }
  }
};

module.exports = planetResolver;
