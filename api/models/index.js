const Sequelize = require("sequelize");

const sequelize = new Sequelize('clash_of_worlds', 'root', 'root', {
  host: 'database',
  dialect: 'postgres'
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
});

exports.models = {
  User: sequelize.import('./user'),
};

const forceDataSync = false

const initDb = async () => {
  await models.User.create({
    firstname: "admin",
    lastname: "admin",
    email: "test@email.com",
    password: "psswrd",
  });
}

sequelize.sync({ force: forceDataSync }).then(() => {
  if (forceDataSync) {
    initDb();
  }
});
