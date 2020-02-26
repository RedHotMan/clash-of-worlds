const { Challenge, User, Planet } = require("../../models");
const { ApolloError } = require("apollo-server");
const {
  CHALLENGE_ADMIN_STATE,
  CHALLENGE_STATE
} = require("../../utils/constants");

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
    },
    acceptChallenge: async (_, { userId, challengeId }) => {
      const user = await User.findByPk(userId);
      const challenge = await Challenge.findByPk(challengeId);

      if (challenge === null) {
        throw new ApolloError("Challenge error", 400, {
          errors: {
            challenge: "This challenge does no exist"
          }
        });
      }

      const defenderPlanet = await Planet.findByPk(challenge.defenderId);

      if (user.planetId !== defenderPlanet.id) {
        throw new ApolloError("Challenge error", 403, {
          errors: {
            user: "You are not a member of the defender planet"
          }
        });
      } else if (userId !== defenderPlanet.leaderId) {
        throw new ApolloError("Challenge error", 403, {
          errors: {
            user:
              "Only the leader of the defendind planet can accept a challenge"
          }
        });
      }

      challenge.update({
        adminState: CHALLENGE_ADMIN_STATE.ACCEPTED,
        state: CHALLENGE_STATE.ONGOING
      });

      return challenge;
    }
  }
};

module.exports = challengeResolver;
