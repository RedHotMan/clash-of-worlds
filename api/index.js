const { ApolloServer } = require("apollo-server");
const sequelize = require("./dbConnect");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers
});

sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connection to the database has been established successfully."
    );
    sequelize.sync();
    server.listen({ port: 4000 }).then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

//TODO: Write a script to feed db with some mocked data
