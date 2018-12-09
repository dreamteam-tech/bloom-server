const Joi = require('joi');
const { JoiError } = require('../errors');
const utils = require('../utils');
const chartService = require('../service/chart');
const models = require('../models');

module.exports = {
  Query: {
    transactions: async (root, args, context, info) => {
      let where = {
        user_id: context.currentUser.id
      };

      if (args.strategy_id) {
        where = {
          ...where,
          strategy_id: args.strategy_id
        };
      }

      return await models.Transaction.findAll({
        where,
        raw: true,
        order: [['id', 'DESC']]
      });
    },
    transaction: async (root, args, context, info) => {
      return await models.Transaction.findOne({
        where: {
          id: args.id,
          user_id: context.currentUser.id
        }
      });
    },
    transactionChart: async (root, args, context, info) => {
      return await chartService.getChart({
        user_id: context.currentUser.id,
        strategy_id: args.strategy_id
      });
    }
  },
  Transaction: {
    strategy: async (root, args, context, info) => {
      return await models.Strategy.findByPk(root.strategy_id);
    }
  },
  Mutation: {
    transactionCreate: async (root, args, context, info) => {
      const value = utils.validate(args, {
        amount: Joi.number().required(),
        user_id: Joi.number().integer().positive().required()
      });

      return await models.Transaction.create(value);
    },
    transactionUpdate: async (root, args, context, info) => {
      const value = utils.validate(args, {
        amount: Joi.number().allow('', null),
        user_id: Joi.number().integer().positive().allow('', null)
      });

      const transaction = await models.Transaction.findByPk(args.id);
      if (null === transaction) {
        throw new JoiError({ id: ['not found'] });
      }

      return await transaction.update(utils.filterValues(value));
    },
    transactionRemove: async (root, args, context, info) => {
      const transaction = await models.Transaction.findByPk(args.id);
      if (null === transaction) {
        throw new JoiError({ id: ['not found'] });
      }
      return await transaction.destroy() > 0;
    }
  }
};
