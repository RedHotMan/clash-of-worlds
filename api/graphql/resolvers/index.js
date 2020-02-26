const userResolver = require("./user");
const planetResolver = require("./planet");
const challengeResolver = require("./challenge");

const resolvers = {
  Query: {
    ...userResolver.Query,
    ...planetResolver.Query,
    ...challengeResolver.Query
  },
  Mutation: {
    ...userResolver.Mutation
  }
};

module.exports = resolvers;
