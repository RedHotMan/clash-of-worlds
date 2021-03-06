const bcrypt = require("bcrypt");
const models = require("../../models");
const Sequelize = require("sequelize");
const {
  AuthenticationError,
  UserInputError,
  ApolloError
} = require("apollo-server");
const generateToken = require("../../utils/generateToken");

const userResolver = {
  User: {
    id: user => user.id,
    username: user => user.username,
    email: user => user.email,
    password: user => user.password,
    role: user => user.role,
    planet: async (user, _, context) => {
      if (user.planetId) {
        return await context.planetLoader.load(user.planetId);
      }

      return null;
    }
  },
  Query: {
    users: async () => {
      return await models.User.findAll();
    },
    user: async (_, { id }, { userLoader }) => {
      return await userLoader.load(id);
    },
    login: async (_, { username, password }) => {
      const user = await models.User.findOne({ where: { username } });

      if (!user) {
        throw new AuthenticationError("User not found");
      }

      if (await bcrypt.compare(password, user.password)) {
        return {
          token: await generateToken(user)
        };
      } else {
        throw new AuthenticationError("Wrong credentials");
      }
    }
  },
  Mutation: {
    register: async (
      _,
      { registerInput: { username, email, password, role, planetId } },
      context
    ) => {
      if ((await context.planetLoader.load(planetId)) == null) {
        throw new UserInputError("Registration error", {
          errors: { planetId: "The selected planet does not exist" }
        });
      }

      const Op = Sequelize.Op;
      const user = await models.User.findOne({
        where: {
          [Op.or]: [{ username }, { email }]
        }
      });

      if (user) {
        const errors = {};

        if (username === user.username) {
          errors.username = `The username ${username} is already taken.`;
        }

        if (email === user.email) {
          errors.email = `User with email ${email} already exist`;
        }
        throw new UserInputError("Registration error", { errors });
      }

      const newUser = await models.User.create({
        username,
        email,
        password: await bcrypt.hash(password, 12),
        role,
        planetId
      });

      return {
        token: await generateToken(newUser)
      };
    }
  }
};

module.exports = userResolver;
