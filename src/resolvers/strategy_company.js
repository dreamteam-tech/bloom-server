const models = require('../models');

module.exports = {
  StrategyCompany: {
    strategy: async (root, args, context, info) => {
      return await models.Strategy.findByPk(root.strategy_id, { raw: true });
    },
    company: async (root, args, context, info) => {
      return await models.Company.findByPk(root.company_id, { raw: true });
    }
  }
};
