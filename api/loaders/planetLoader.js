const DataLoader = require("dataloader");
const { Planet } = require("../models");

const batchPlanets = async ids => {
  const planets = await Planet.findAll({ where: { id: ids } });

  const planetMap = {};
  planets.forEach(planet => {
    planetMap[planet.id] = planet;
  });

  return ids.map(id => planetMap[id]);
};

const planetLoader = new DataLoader(batchPlanets);

module.exports = planetLoader;
