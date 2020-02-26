const {
  CHALLENGE_ADMIN_STATE,
  CHALLENGE_WINNER
} = require("../utils/constants");

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
      validate: { isAfter: new Date().toString() }
    },
    attackerId: {
      type: DataTypes.INTEGER
    },
    defenderId: {
      type: DataTypes.INTEGER
    },
    winner: {
      type: DataTypes.ENUM(
        CHALLENGE_WINNER.ATTACKER,
        CHALLENGE_WINNER.DEFENDERS
      ),
      allowNull: true
    }
  });

  return Challenge;
};

module.exports = challenge;
