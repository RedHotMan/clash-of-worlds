const md5 = require("md5");
const sequelize = require("../dbConnect");
const models = require("../models");
const { AuthenticationError, UserInputError } = require("apollo-server");
const { registerValidation, loginValidation } = require("../utils/validators");

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
      const { errors, valid } = registerValidation(username, email, password);

      if (!valid) {
        throw new UserInputError("Registration error", { errors });
      }

      const user = await models.User.findOne({ where: { username } });

      if (user) {
        throw new UserInputError("Username already taken", {
          errors: {
            username: `The username ${username} is already taken.`
          }
        });
      }

      return await models.User.create({
        username,
        email,
        password: await md5(password)
      });
    },
    login: async (_, { username, password }) => {
      const { errors, valid } = loginValidation(username, password);

      if (!valid) {
        throw new UserInputError("Login error", { errors });
      }

      const user = await models.User.findOne({ where: { username } });

      if (!user) {
        throw new AuthenticationError("User not found");
      }

      if ((await md5(password)) === user.password) {
        return user;
      } else {
        throw new AuthenticationError("Wrong credentials");
      }
    }
  }
};

module.exports = resolvers;
