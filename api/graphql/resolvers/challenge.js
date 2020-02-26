const { Challenge } = require("../../models");
const { ApolloError } = require("apollo-server");

const challengeResolver = {
  Query: {
    challenges: async () => {
      return await Challenge.findAll();
    },
    challenge: async (_, { id }) => {
      return await Challenge.findByPk(id);
    }
  },
  Mutation: {
    createChallenge: async (
      _,
      { attackerId, defenderId, description, date, pointsInGame }
    ) => {
      if (attackerId === defenderId) {
        throw new ApolloError("Challenge error", 403, {
          errors: {
            defenderId: "The defending planet can not be the attacking planet"
          }
        });
      }

      return await Challenge.create({
        description,
        date,
        attackerId,
        defenderId,
        pointsInGame
      });
    }
  }
};

module.exports = challengeResolver;
