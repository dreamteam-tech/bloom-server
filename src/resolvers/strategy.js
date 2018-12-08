const Joi = require('joi');
const { JoiError } = require('../errors');
const utils = require('../utils');
const models = require('../models');

module.exports = {
  Query: {
    strategies: async (root, args, context, info) => {
      return await models.Strategy.findAll({
        order: [['id', 'DESC']]
      });
    },
    strategy: async (root, args, context, info) => {
      return await models.Strategy.findByPk(args.id);
    }
  },
  Mutation: {
    strategyCreate: async (root, args, context, info) => {
      const value = utils.validate(args, {
        name: Joi.string().required(),
        description: Joi.string().required(),
        percent: Joi.number().required(),
      });

      return await models.Strategy.create(value);
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
