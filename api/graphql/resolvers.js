const bcrypt = require("bcrypt");
const sequelize = require("../dbConnect");
const models = require("../models");
const { generateToken } = require("../utils/generateToken");
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

      const newUser = await models.User.create({
        username,
        email,
        password: await bcrypt.hash(password, 12)
      });

      return {
        ...newUser.dataValues,
        token: await generateToken(newUser)
      };
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

      if (await bcrypt.compare(password, user.password)) {
        return {
          ...user.dataValues,
          token: await generateToken(user)
        };
      } else {
        throw new AuthenticationError("Wrong credentials");
      }
    }
  }
};

module.exports = resolvers;
