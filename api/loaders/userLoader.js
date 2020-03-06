const DataLoader = require("dataloader");
const { User } = require("../models");

const batchUsers = async ids => {
  const users = await User.findAll({ where: { id: ids } });

  const userMap = {};
  users.forEach(user => {
    userMap[user.id] = user;
  });

  return ids.map(id => userMap[id]);
};

const userLoader = new DataLoader(batchUsers);

module.exports = userLoader;
