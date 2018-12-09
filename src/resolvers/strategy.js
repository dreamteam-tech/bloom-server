const Joi = require('joi');
const { JoiError } = require('../errors');
const utils = require('../utils');
const models = require('../models');

module.exports = {
  Query: {
    strategies: async (root, args, context, info) => {
      const strategies = await models.Strategy.findAll({
        raw: true,
        order: [['position', 'ASC']]
      });

      const result = [];
      for (let i = 0; i < strategies.length; i++) {
        const strategy = strategies[i];
        result.push({
          ...strategy,
          has_investments: await models.Transaction.count({
            where: {
              strategy_id: strategy.id,
              user_id: context.currentUser.id
            }
          }) > 0
        });
      }

      return result;
    },
    strategy: async (root, args, context, info) => {
      const strategy = await models.Strategy.findByPk(args.id, {
        raw: true
      });

      return {
        ...strategy,
        has_investments: await models.Transaction.count({
          where: {
            strategy_id: strategy.id,
            user_id: context.currentUser.id
          }
        }) > 0
      }
    }
  },
  Strategy: {
    companies: async (root, args, context, info) => {
      return await models.StrategyCompany.findAll({
        where: { strategy_id: root.id },
        raw: true
      });
    }
  },
  Mutation: {
    strategyCreate: async (root, args, context, info) => {
      const value = utils.validate(args, {
        name: Joi.string().required(),
        description: Joi.string().required(),
        percent: Joi.number().required(),
      });

      return await models.Strategy.create({
        ...value,
        author_id: context.currentUser.id
      });
    },
    strategyUpdate: async (root, args, context, info) => {
      const value = utils.validate(args, {
        name: Joi.string().allow(null, ''),
        description: Joi.string().allow(null, ''),
        percent: Joi.number().allow(null, ''),
      });

      const strategy = await models.Strategy.findByPk(args.id);
      if (null === strategy) {
        throw new JoiError({ id: ['not found'] });
      }

      return await strategy.update(utils.filterValues(value));
    },
    strategyRemove: async (root, args, context, info) => {
      const strategy = await models.Strategy.findByPk(args.id);
      if (null === strategy) {
        throw new JoiError({ id: ['not found'] });
      }
      return await strategy.destroy() > 0;
    }
  }
};
