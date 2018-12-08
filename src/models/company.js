module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false }
  }, {
    tableName: 'company'
  });

  Company.associate = models => {};

  return Company;
};
