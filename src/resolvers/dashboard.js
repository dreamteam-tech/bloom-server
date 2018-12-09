const models = require('../models');
const consts = require('../consts');
const chartService = require('../service/chart');

module.exports = {
  Query: {
    dashboard: async (root, args, context, info) => {
      const result = [];

      const strategies = await models.Strategy.findAll({
        raw: true,
        order: [['position', 'ASC']]
      });
      for (let i = 0; i < strategies.length; i++) {
        const strategy = strategies[i];
        result.push({
          strategy,
          amount: await models.Transaction.sum('amount', {
            where: {
              user_id: context.currentUser.id,
              strategy_id: strategy.id
            }
          }) || 0,
          invested: await models.Transaction.sum('amount', {
            where: {
              type: consts.TRANSACTION_PAYMENT,
              user_id: context.currentUser.id,
              strategy_id: strategy.id
            }
          }) || 0,
          chart: await chartService.getSummaryChart({
            user_id: context.currentUser.id,
            strategy_id: strategy.id
          })
        });
      }

      return result;
    }
  }
};
