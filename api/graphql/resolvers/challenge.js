const { Challenge, User, Planet } = require("../../models");
const { ApolloError } = require("apollo-server");
const {
  CHALLENGE_ADMIN_STATE,
  CHALLENGE_STATE
} = require("../../utils/constants");

const findChallengeById = async challengeId => {
  const challenge = await Challenge.findByPk(challengeId);

  // If the challenge doesn't exist, throw error
  if (challenge === null) {
    throw new ApolloError("Challenge error", 400, {
      errors: {
        challenge: "This challenge does no exist"
      }
    });
  }

  return challenge;
};

const checkIfUserLeaderOfPlanet = async (user, planet) => {
  if (user.planetId !== planet.id) {
    throw new ApolloError("Challenge error", 403, {
      errors: {
        user: "You are not a member of the planet"
      }
    });
  } else if (user.id !== planet.leaderId) {
    throw new ApolloError("Challenge error", 403, {
      errors: {
        user: "Only the leader of the planet can accept or refuse a challenge"
      }
    });
  }
};

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
      { userId, attackerId, defenderId, description, date, pointsInGame }
    ) => {
      const attackerPlanet = await Planet.findByPk(attackerId);
      const user = await User.findByPk(userId);

      // Only the leader of the attacking planet can launch a challenge
      if (user.planetId !== attackerPlanet.id) {
        throw new ApolloError("Challenger error", 403, {
          errors: {
            user:
              "You have to be a member of the attacking planet to launch a challenge"
          }
        });
      } else if (userId !== attackerPlanet.leaderId) {
        throw new ApolloError("Challenge error", 403, {
          errors: {
            user: `Only the leader of the attacking team can launch a challenge`
          }
        });
      }

      // You have to challenge another planet, not yours
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

    cancelChallenge: async (_, { userId, challengeId }) => {
      const user = await User.findByPk(userId);
      const challenge = await findChallengeById(challengeId);
      const attackerPlanet = await Planet.findByPk(challenge.attackerId);

      // You have to be a member and the leader of the attacking planet to accept or refuse a challenge
      await checkIfUserLeaderOfPlanet(user, attackerPlanet);

      // Don't change adminState of challenge if it has already been accepted, refused or canceled
      if (
        challenge.adminState === CHALLENGE_ADMIN_STATE.ACCEPTED ||
        challenge.adminState === CHALLENGE_ADMIN_STATE.REFUSED ||
        challenge.adminState === CHALLENGE_ADMIN_STATE.CANCELED
      ) {
        throw new ApolloError("Challenge error", 403, {
          errors: {
            adminState:
              "The challenge has already been accepted, refused or cnaceled"
          }
        });
      }

      challenge.update({
        adminState: CHALLENGE_ADMIN_STATE.CANCELED
      });

      return challenge;
    },

    manageChallengeAdminState: async (
      _,
      { userId, challengeId, newAdminState }
    ) => {
      const user = await User.findByPk(userId);
      const challenge = await findChallengeById(challengeId);

      const defenderPlanet = await Planet.findByPk(challenge.defenderId);

      // You have to be a member and the leader of the defending planet to accept or refuse a challenge
      await checkIfUserLeaderOfPlanet(user, defenderPlanet);

      // You have to choose a new adminState
      if (newAdminState === challenge.adminState) {
        throw new ApolloError("Challenge error", 403, {
          errors: {
            adminState: `This challenge adminState is already '${newAdminState}'`
          }
        });
      }
      // You can't set adminState to "Waiting"
      else if (newAdminState === CHALLENGE_ADMIN_STATE.WAITING) {
        throw new ApolloError("Challenge error", 403, {
          errors: {
            adminState: "You can not return to a waiting adminState"
          }
        });
      }
      // If the challenge is Accepted or Refused, you can't change its adminState
      else if (
        challenge.adminState === CHALLENGE_ADMIN_STATE.ACCEPTED ||
        challenge.adminState === CHALLENGE_ADMIN_STATE.REFUSED ||
        challenge.adminState === CHALLENGE_ADMIN_STATE.CANCELED
      ) {
        throw new ApolloError("Challenge error", 403, {
          errors: {
            adminState:
              "You can not change adminState when it's 'Accepted', 'Refused' or 'Canceled'"
          }
        });
      }

      challenge.update({
        adminState: newAdminState,
        state:
          newAdminState === CHALLENGE_ADMIN_STATE.ACCEPTED
            ? CHALLENGE_STATE.ONGOING
            : CHALLENGE_STATE.FINISHED
      });

      return challenge;
    }
  }
};

module.exports = challengeResolver;
