const { ApolloServer } = require("apollo-server");
const sequelize = require("./dbConnect");
const { User, Planet } = require("./models");
const { ADMIN } = require("./utils/roles");
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

    sequelize.sync({ force: true }).then(() => {
      Planet.create(
        {
          name: "DonutsFactory",
          users: [
            {
              username: "Bejita",
              email: "bejita@email.com",
              password: "psswrd"
            }
          ]
        },
        {
          include: [{ association: Planet.hasMany(User) }]
        }
      );

      Planet.create({
        name: "RaccoonsOfAsgard"
      });
      Planet.create({
        name: "DucksInvaders"
      });
      Planet.create({
        name: "SkizoCats"
      });

      User.create({
        username: "admin",
        email: "admin@admin.com",
        password: "admin",
        role: ADMIN,
        planetId: 1
      });
    });
    server.listen({ port: 4000 }).then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

//TODO: Write a BETTER script to feed db with some mocked data
