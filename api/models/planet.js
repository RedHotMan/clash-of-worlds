const planet = (sequelise, DataTypes) => {
  const Planet = sequelise.define("planet", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    inGoingChallenges: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  });

  return Planet;
};

module.exports = planet;
