const Joi = require('joi');
const { JoiError } = require('../errors');
const utils = require('../utils');
const models = require('../models');

module.exports = {
  Query: {
    transactions: async (root, args, context, info) => {
      return await models.Transaction.findAll({
        where: {
          strategy_id: args.strategy_id
          // user_id: context.currentUser.id
        },
        order: [['id', 'DESC']]
      });
    },
    transaction: async (root, args, context, info) => {
      return await models.Transaction.findByPk(args.id);
    },
    transactionChart: async (root, args, context, info) => {
      const chartUserSqlQuery = `
        select to_char(d, 'YYYY-MM') as date, COALESCE(sum("b"."amount"), 0) as value
        from generate_series(date('now') - interval '1 year', date('now'), interval '1 day') d
               left join lateral (
            select "b"."amount"
            from "transaction" "b"
            where
              date("b"."created_at") = d
              and "b"."user_id" = :user_id
              and "b"."strategy_id" = :strategy_id
            group by "b"."amount"
            ) b ON true
        group by date
        order by date;
      `;
      const chartSqlQuery = `
        select to_char(d, 'YYYY-MM') as date, COALESCE(sum("b"."amount"), 0) as value
        from generate_series(date('now') - interval '1 year', date('now'), interval '1 day') d
               left join lateral (
            select "b"."amount"
            from "transaction" "b"
            where
              date("b"."created_at") = d
              and "b"."strategy_id" = :strategy_id
            group by "b"."amount"
            ) b ON true
        group by date
        order by date;
      `;

      return models.sequelize.query(chartSqlQuery, {
        type: models.sequelize.QueryTypes.SELECT,
        replacements: {
          // user_id: context.currentUser.id,
          strategy_id: args.strategy_id
        }
      });
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
