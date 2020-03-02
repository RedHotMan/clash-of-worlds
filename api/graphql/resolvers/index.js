const userResolver = require("./user");
const planetResolver = require("./planet");
const challengeResolver = require("./challenge");

const resolvers = {
  User: {
    ...userResolver.User
  },
  Challenge: {
    ...challengeResolver.Challenge
  },
  Planet: {
    ...planetResolver.Planet
  },
  Query: {
    ...userResolver.Query,
    ...planetResolver.Query,
    ...challengeResolver.Query
  },
  Mutation: {
    ...userResolver.Mutation,
    ...challengeResolver.Mutation
  }
};

module.exports = resolvers;
