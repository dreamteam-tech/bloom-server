const models = require('../models');
const sequelize = models.sequelize;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    for (let name in models) {
      if (['sequelize', 'StrategyCompany'].indexOf(name) > -1) {
        continue;
      }

      const model = models[name];
      const tableName = model.getTableName();
      const sql = `SELECT setval('${tableName}_id_seq', COALESCE((SELECT MAX("${tableName}"."id")+1 FROM "${tableName}" AS "${tableName}"), 1), false);`;
      await sequelize.query(sql, {
        type: sequelize.QueryTypes.SELECT
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
  }
};
