const moment = require("moment");
const { Challenge, User, Planet } = require("../../models");
const { ApolloError } = require("apollo-server");
const {
  CHALLENGE_ADMIN_STATE,
  CHALLENGE_STATE,
  ROLES,
  PLANET_SIDES
} = require("../../utils/constants");
const { createChallengeValidation } = require("../../utils/validators");
const isAuthenticated = require("../../utils/isAuthenticated");

const findChallengeById = async (challengeId, challengeLoader) => {
  const challenge = await challengeLoader.load(challengeId);

  // If the challenge doesn't exist, throw error
  if (challenge == null) {
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

const manageAdminStateChallenge = async (
  context,
  userId,
  challengeId,
  planetSideToCheck
) => {
  const user = await context.userLoader.load(userId);
  const challenge = await findChallengeById(
    challengeId,
    context.challengeLoader
  );

  const planet = await context.planetLoader.load(
    planetSideToCheck === PLANET_SIDES.ATTACKER
      ? challenge.attackerId
      : challenge.defenderId
  );

  await checkIfUserLeaderOfPlanet(user, planet);

  if (
    challenge.adminState === CHALLENGE_ADMIN_STATE.ACCEPTED ||
    challenge.adminState === CHALLENGE_ADMIN_STATE.REFUSED ||
    challenge.adminState === CHALLENGE_ADMIN_STATE.CANCELED
  ) {
    throw new ApolloError("Challenge error", "CHALLENGE_ADMIN_STATE_ERROR", {
      errors: {
        adminState: "Challenge is already 'Accepted', 'Refused' or 'Canceled'"
      }
    });
  }

  return challenge;
};

const challengeResolver = {
  Challenge: {
    id: challenge => challenge.id,
    date: challenge => moment(challenge.date).format(),
    state: challenge => challenge.state,
    adminState: challenge => challenge.adminState,
    description: challenge => challenge.description,
    pointsInGame: challenge => challenge.pointsInGame,
    winner: challenge => challenge.winner,
    attacker: async (challenge, _, context) => {
      return await context.planetLoader.load(challenge.attackerId);
    },
    defender: async (challenge, _, context) => {
      return await context.planetLoader.load(challenge.defenderId);
    }
  },
  Query: {
    challenges: async (_, args, { decodedToken }) => {
      isAuthenticated(decodedToken);
      return await Challenge.findAll();
    },
    challenge: async (_, { id }, { challengeLoader, decodedToken }) => {
      isAuthenticated(decodedToken);
      return await challengeLoader.load(id);
    }
  },
  Mutation: {
    createChallenge: async (
      _,
      { userId, attackerId, defenderId, description, date, pointsInGame },
      context
    ) => {
      isAuthenticated(context.decodedToken);
      const { errors, valid } = createChallengeValidation(description, date);

      if (!valid) {
        throw new ApolloError("Challenge error", "CHALLENGE_NOT_CREATED", {
          errors
        });
      }

      const attackerPlanet = await context.planetLoader.load(attackerId);
      const user = await context.userLoader.load(userId);

      await checkIfUserLeaderOfPlanet(user, attackerPlanet);

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
        date: moment(date, "MM/DD/YYYY")
          .startOf("day")
          .format(),
        attackerId,
        defenderId,
        pointsInGame
      });
    },

    cancelChallenge: async (_, { userId, challengeId }, context) => {
      isAuthenticated(context.decodedToken);
      const challenge = await manageAdminStateChallenge(
        context,
        userId,
        challengeId,
        PLANET_SIDES.ATTACKER
      );

      return challenge.update({
        adminState: CHALLENGE_ADMIN_STATE.CANCELED
      });
    },

    acceptChallenge: async (_, { userId, challengeId }, context) => {
      isAuthenticated(context.decodedToken);
      const challenge = await manageAdminStateChallenge(
        context,
        userId,
        challengeId,
        PLANET_SIDES.DEFENDER
      );

      return challenge.update({
        adminState: CHALLENGE_ADMIN_STATE.ACCEPTED,
        state: CHALLENGE_STATE.ONGOING
      });
    },

    refuseChallenge: async (_, { userId, challengeId }, context) => {
      isAuthenticated(context.decodedToken);
      const challenge = await manageAdminStateChallenge(
        context,
        userId,
        challengeId,
        PLANET_SIDES.DEFENDER
      );

      return challenge.update({
        adminState: CHALLENGE_ADMIN_STATE.REFUSED,
        state: CHALLENGE_STATE.FINISHED
      });
    },

    setWinnerChallenge: async (_, { userId, challengeId, winner }, context) => {
      isAuthenticated(context.decodedToken);
      const challenge = await findChallengeById(
        challengeId,
        context.challengeLoader
      );
      const user = await context.userLoader.load(userId);

      if (!user.role === ROLES.ADMIN) {
        throw new ApolloError("Challenger error", 400, {
          errors: {
            user: {
              role: "Only an admin can set the winner of a challenge"
            }
          }
        });
      }

      if (moment().isBefore(moment(challenge.date))) {
        throw new ApolloError("Challlenge error", 400, {
          errors: {
            date:
              "You can not design a winner for this challenge before the challenge date"
          }
        });
      }

      if (challenge.adminState !== CHALLENGE_ADMIN_STATE.ACCEPTED) {
        throw new ApolloError("Challenge error", 400, {
          errors: {
            adminState: "The challenge hasn't been accepted yet"
          }
        });
      }

      challenge.update({
        winner,
        state: CHALLENGE_STATE.FINISHED
      });

      const attackerPlanet = await context.planetLoader.load(
        challenge.attackerId
      );
      const defenderPlanet = await context.planetLoader.load(
        challenge.defenderId
      );

      if (winner === PLANET_SIDES.ATTACKER) {
        await attackerPlanet.increment("points", {
          by: challenge.pointsInGame
        });

        if (defenderPlanet.points - challenge.pointsInGame / 2 >= 0) {
          await defenderPlanet.decrement("points", {
            by: challenge.pointsInGame / 2
          });
        }
      } else {
        await defenderPlanet.increment("points", {
          by: challenge.pointsInGame
        });

        if (attackerPlanet.points - challenge.pointsInGame / 2 >= 0) {
          await attackerPlanet.decrement("points", {
            by: challenge.pointsInGame / 2
          });
        }
      }

      return challenge;
    }
  }
};

module.exports = challengeResolver;
