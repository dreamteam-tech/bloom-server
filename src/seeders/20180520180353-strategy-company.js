module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('strategy_company', null, {});
    await queryInterface.bulkInsert('strategy_company', [
      {
        strategy_id: 1,
        company_id: 1
      },
      {
        strategy_id: 1,
        company_id: 2
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('strategy_company', null, {});
  }
};
