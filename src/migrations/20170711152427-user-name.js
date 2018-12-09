module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.addColumn('user', 'first_name', {
        type: Sequelize.STRING,
        allowNull: false
      }, { transaction });
      await queryInterface.addColumn('user', 'last_name', {
        type: Sequelize.STRING,
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
      await queryInterface.removeColumn('user', 'first_name', { transaction });
      await queryInterface.removeColumn('user', 'last_name', { transaction });

      transaction.commit();
    } catch (e) {
      transaction.rollback();
      throw e;
    }
  }
};
