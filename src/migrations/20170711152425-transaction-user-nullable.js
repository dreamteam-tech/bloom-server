module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.changeColumn('transaction', 'user_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'user',
          key: 'id'
        },
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
      await queryInterface.changeColumn('transaction', 'user_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id'
        },
      }, { transaction });

      transaction.commit();
    } catch (e) {
      transaction.rollback();
      throw e;
    }
  }
};
