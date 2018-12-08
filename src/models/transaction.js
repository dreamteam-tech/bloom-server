module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    amount: { type: DataTypes.DOUBLE, allowNull: false },
    type: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
  }, {
    tableName: 'transaction',
    timestamps: true
  });

  Transaction.associate = models => {
    Transaction.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'user_id'
    });
    Transaction.belongsTo(models.Strategy, {
      as: 'strategy',
      foreignKey: 'strategy_id'
    });
  };

  return Transaction;
};
