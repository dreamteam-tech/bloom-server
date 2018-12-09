const BigNumber = require('bignumber.js');
const models = require('../models');
const consts = require('../consts');
const chartService = require('../service/chart');

const bigNumberify = value => new BigNumber(value);

const calc = (amountRaw, investedRaw) => {
  const amount = bigNumberify(amountRaw);
  const invested = bigNumberify(investedRaw);
  if (amount.isEqualTo(invested)) {
    return 0;
  }

  return amount
    .minus(invested)
    .div(amount)
    .multipliedBy(100)
    .toNumber()
    .toFixed(2);
};

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
        const amount = await models.Transaction.sum('amount', {
          where: {
            type: { [Op.not]: consts.TRANSACTION_WITHDRAW },
            user_id: context.currentUser.id,
            strategy_id: strategy.id
          }
        }) || 0;
        const invested = await models.Transaction.sum('amount', {
          where: {
            type: consts.TRANSACTION_PAYMENT,
            user_id: context.currentUser.id,
            strategy_id: strategy.id
          }
        }) || 0;

        const percent = calc(amount, invested);

        result.push({
          strategy,
          amount,
          percent,
          invested,
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
