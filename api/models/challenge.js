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
    admin_state: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: CHALLENGE_ADMIN_STATE.WAITING
    }
  });

  return Challenge;
};

module.exports = challenge;
