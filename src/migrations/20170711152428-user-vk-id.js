module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.addColumn('user', 'vk_id', {
        type: Sequelize.INTEGER,
        allowNull: true
      }, { transaction });

      transaction.commit();
    } catch (e) {
      transaction.rollback();
      throw e;
    }
  },
  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeColumn('user', 'vk_id', { transaction });

      transaction.commit();
    } catch (e) {
      transaction.rollback();
      throw e;
    }
  }
};
