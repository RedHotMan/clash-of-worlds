const models = require('./models').models;

const resolvers = {
  Query: {
    users: async () => {
      return await models.User.findAll();
    },
    user: async (obj, args, context, info) => {
      return await models.User.findByPk(args.id);
    },
    createUser: async (obj, args, context, info) => {
      return await models.User.create({
        firstname: args.firstname,
        lastname: args.lastname,
        username: args.username,
        email: args.email,
        password: args.password,
        role: args.role,
      })
    }
  }
};

module.exports = resolvers;
