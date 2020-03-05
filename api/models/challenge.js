const moment = require("moment");
const { CHALLENGE_ADMIN_STATE, PLANET_SIDES } = require("../utils/constants");

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
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfter: moment()
          .subtract(1, "days")
          .startOf("day")
          .format()
      }
    },
    attackerId: {
      type: DataTypes.INTEGER
    },
    defenderId: {
      type: DataTypes.INTEGER
    },
    winner: {
      type: DataTypes.ENUM(PLANET_SIDES.ATTACKER, PLANET_SIDES.DEFENDER),
      allowNull: true
    }
  });

  return Challenge;
};

module.exports = challenge;
