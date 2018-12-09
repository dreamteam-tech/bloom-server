const models = require('../models');

module.exports = {
  Query: {
    /**
     * Профиль пользователя
     *
     * @param root
     * @param args
     * @param context
     * @param info
     * @returns {Promise<*>}
     */
    me: async (root, args, context, info) => {
      return context.currentUser;
    },

    users: async (root, args, context, info) => {
      return await models.User.findAll({
        raw: true
      });
    },

    user: async (root, args, context, info) => {
      return await models.User.findByPk(args.id, {
        raw: true
      });
    },
  }
};
