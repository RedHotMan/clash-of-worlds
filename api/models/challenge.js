const { CHALLENGE_ADMIN_STATE } = require("../utils/constants");

const challenge = (sequelize, DataTypes) => {
  const Challenge = sequelize.define("challenge", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    adminState: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: CHALLENGE_ADMIN_STATE.WAITING
    },
    pointsInGame: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      validate: { min: 10, max: 200 }
    }
  });

  return Challenge;
};

module.exports = challenge;
