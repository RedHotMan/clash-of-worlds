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
    planet: async user => {
      return await models.Planet.findByPk(user.planetId);
    }
  },
  Query: {
    users: async () => {
      return await models.User.findAll();
    },
    user: async (_, { id }) => {
      return await models.User.findByPk(id);
    }
  },
  Mutation: {
    register: async (
      _,
      { registerInput: { username, email, password, role, planetId } }
    ) => {
      let { errors, valid } = registerValidation(
        username,
        email,
        password,
        role
      );

      if ((await models.Planet.findByPk(planetId)) === null) {
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

module.exports = userResolver;
