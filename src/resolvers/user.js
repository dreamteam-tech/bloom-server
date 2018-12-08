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
    }
  }
};
