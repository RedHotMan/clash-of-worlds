const bcrypt = require("bcrypt");
const models = require("../../models");
const Sequelize = require("sequelize");
const { AuthenticationError, UserInputError } = require("apollo-server");
const {
  registerValidation,
  loginValidation
} = require("../../utils/validators");
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
    users: async (_, args, { decodedToken }) => {
      if (!decodedToken) {
        throw new AuthenticationError("You must be authenticated");
      }
      return await models.User.findAll();
    },
    user: async (_, { id }, context) => {
      return await context.userLoader.load(id);
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
      let { errors, valid } = registerValidation(
        username,
        email,
        password,
        role
      );

      if ((await context.planetLoader.load(planetId)) == null) {
        errors.planet = `The planet selected does not exist.`;
        valid = false;
      }

      if (!valid) {
        throw new UserInputError("Registration error", { errors });
      }

      const Op = Sequelize.Op;
      const user = await models.User.findOne({
        where: {
          [Op.or]: [{ username }, { email }]
        }
      });

      if (user) {
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
