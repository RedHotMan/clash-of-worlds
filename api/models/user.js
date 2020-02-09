const { Planet } = require("../models");
const { USER } = require("../utils/roles");

const user = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: USER
    },
    planetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Planet,
        key: "id"
      }
    }
  });

  return User;
};

module.exports = user;
