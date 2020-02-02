const ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

const user = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true
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
      defaultValue: ROLES.USER
    }
  });

  return User;
}

module.exports = user;
