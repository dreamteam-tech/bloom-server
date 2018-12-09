module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.addColumn('strategy_company', 'percent', {
        type: Sequelize.DOUBLE,
        allowNull: false
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
      await queryInterface.removeColumn('strategy_company', 'percent', { transaction });

      transaction.commit();
    } catch (e) {
      transaction.rollback();
      throw e;
    }
  }
};
