const { Challenge } = require("../../models");

const challengeResolver = {
  Query: {
    challenges: async () => {
      return await Challenge.findAll();
    },
    challenge: async (_, { id }) => {
      return await Challenge.findByPk(id);
    }
  }
};

module.exports = challengeResolver;
