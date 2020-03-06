const DataLoader = require("dataloader");
const { Challenge } = require("../models");

const batchChallenges = async ids => {
  const challenges = await Challenge.findAll({ where: { id: ids } });

  const challengeMap = {};
  challenges.forEach(challenge => {
    challengeMap[challenge.id] = challenge;
  });

  return ids.map(id => challengeMap[id]);
};

const challengeLoader = new DataLoader(batchChallenges);

module.exports = challengeLoader;
