module.exports = (sequelize, DataTypes) => {
  const StrategyCompany = sequelize.define('StrategyCompany', {
    percent: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
  }, {
    tableName: 'strategy_company'
  });

  StrategyCompany.associate = models => {
    StrategyCompany.belongsTo(models.Strategy, {
      as: 'strategy',
      foreignKey: 'strategy_id'
    });
    StrategyCompany.belongsTo(models.Company, {
      as: 'company',
      foreignKey: 'company_id'
    });
  };

  return StrategyCompany;
};
