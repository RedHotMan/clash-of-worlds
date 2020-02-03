const md5 = require("md5");
const sequelize = require("../dbConnect");
const models = require("../models");

const resolvers = {
  Query: {
    users: async () => {
      return await models.User.findAll();
    },
    user: async (_, { id }) => {
      return await models.User.findByPk(id);
    }
  },
  Mutation: {
    register: async (_, { registerInput: { username, email, password } }) => {
      // TODO: validate user data
      // TODO: Make sure username or user
      return await models.User.create({
        username,
        email,
        password: await md5(password)
      });
    }
  }
};

module.exports = resolvers;
