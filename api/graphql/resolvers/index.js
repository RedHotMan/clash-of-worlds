const userResolver = require("./user");
const planetResolver = require("./planet");

const resolvers = {
  Query: {
    ...userResolver.Query,
    ...planetResolver.Query
  },
  Mutation: {
    ...userResolver.Mutation
  }
};

module.exports = resolvers;
