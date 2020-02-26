const { Challenge } = require("../../models");

const challengeResolver = {
  Query: {
    challenges: async () => {
      return await Challenge.findAll();
    }
  }
};

module.exports = challengeResolver;
