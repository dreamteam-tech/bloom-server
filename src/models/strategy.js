module.exports = (sequelize, DataTypes) => {
  const Strategy = sequelize.define('Strategy', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    percent: { type: DataTypes.DOUBLE, allowNull: false },
    color: { type: DataTypes.STRING, allowNull: false, defaultValue: '#ccc' },
    position: { type: DataTypes.INT, allowNull: false, defaultValue: 0 }
  }, {
    tableName: 'strategy',
    timestamps: true
  });

  Strategy.associate = models => {
    Strategy.belongsTo(models.User, {
      as: 'author',
      foreignKey: 'author_id'
    });

    Strategy.belongsToMany(models.Company, {
      through: models.StrategyCompany,
      as: 'companies'
    });
  };

  return Strategy;
};
