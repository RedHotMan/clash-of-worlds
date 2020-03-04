const { ApolloServer } = require("apollo-server");
const sequelize = require("./dbConnect");
const { User, Planet } = require("./models");
const { ROLES } = require("./utils/constants");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/index");
const bcrypt = require("bcrypt");
const planetLoader = require("./loaders/planetLoader");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    return {
      planetLoader
    };
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connection to the database has been established successfully."
    );

    sequelize.sync().then(() => {
      server.listen({ port: 4000 }).then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`);
      });
    });
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });
