const models = require("../../models");
const isAuthenticated = require("../../utils/isAuthenticated");

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
    planets: async (_, args, { decodedToken }) => {
      isAuthenticated(decodedToken);
      return await models.Planet.findAll();
    },
    planet: async (_, { id }, { decodedToken, planetLoader }) => {
      isAuthenticated(decodedToken);
      return await planetLoader.load(id);
    }
  }
};

module.exports = planetResolver;
