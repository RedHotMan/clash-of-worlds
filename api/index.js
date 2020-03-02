const { ApolloServer } = require("apollo-server");
const sequelize = require("./dbConnect");
const { User, Planet } = require("./models");
const { ROLES } = require("./utils/constants");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/index");
const bcrypt = require("bcrypt");

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

    sequelize
      .sync({ force: true })
      .then(async () => {
        Planet.create(
          {
            name: "DonutsFactory",
            leaderId: "13dc1e5c-eb36-4919-9f8f-4978019dd127",
            users: [
              {
                id: "13dc1e5c-eb36-4919-9f8f-4978019dd127",
                username: "Broly",
                email: "broly@email.com",
                password: await bcrypt.hash("admin", 12)
              }
            ]
          },
          {
            include: [{ association: Planet.hasMany(User) }]
          }
        );

        Planet.create(
          {
            name: "RaccoonsOfAsgard",
            leaderId: "48bd03b3-0332-4ed0-b098-bc2da667081c",
            users: [
              {
                id: "48bd03b3-0332-4ed0-b098-bc2da667081c",
                username: "Bejita",
                email: "bejita@email.com",
                password: await bcrypt.hash("psswrd", 12)
              }
            ]
          },
          {
            include: [{ association: Planet.hasMany(User) }]
          }
        );

        Planet.create(
          {
            name: "DucksInvaders",
            leaderId: "26d16c57-1629-482b-a7d2-e8dab6097887",
            users: [
              {
                id: "26d16c57-1629-482b-a7d2-e8dab6097887",
                username: "Gohan",
                email: "gohan@email.com",
                password: await bcrypt.hash("psswrd", 12)
              }
            ]
          },
          {
            include: [{ association: Planet.hasMany(User) }]
          }
        );

        Planet.create(
          {
            name: "SkizoCats",
            leaderId: "f0010344-8011-4f10-82d3-342ba671fb6f",
            users: [
              {
                id: "f0010344-8011-4f10-82d3-342ba671fb6f",
                username: "Goku",
                email: "goku@email.com",
                password: await bcrypt.hash("psswrd", 12)
              }
            ]
          },
          {
            include: [{ association: Planet.hasMany(User) }]
          }
        );

        User.create({
          id: "d5835597-2b2b-4b87-993f-7f22d4b3583a",
          username: "admin",
          email: "admin@email.com",
          password: await bcrypt.hash("admin", 12)
        });
      })
      .then(() => {
        server.listen({ port: 4000 }).then(({ url }) => {
          console.log(`🚀  Server ready at ${url}`);
        });
      });
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });
