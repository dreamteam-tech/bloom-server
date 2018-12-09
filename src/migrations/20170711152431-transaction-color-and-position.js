module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.addColumn('transaction', 'color', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '#ccc'
      }, { transaction });
      await queryInterface.addColumn('transaction', 'position', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
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
      await queryInterface.removeColumn('transaction', 'color', { transaction });
      await queryInterface.removeColumn('transaction', 'position', { transaction });

      transaction.commit();
    } catch (e) {
      transaction.rollback();
      throw e;
    }
  }
};
