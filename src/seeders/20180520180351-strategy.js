module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('strategy', null, {});
    await queryInterface.bulkInsert('strategy', [
      {
        name: 'Test strategy',
        description: 'Test strategy',
        percent: 10,
        author_id: 1,
        created_at: new Date,
        updated_at: new Date,
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('strategy', null, {});
  }
};
