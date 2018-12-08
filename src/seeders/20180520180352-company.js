module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('company', null, {});
    await queryInterface.bulkInsert('company', [
      {
        id: 1,
        name: 'Google',
        description: 'Google',
        created_at: new Date,
        updated_at: new Date,
      },
      {
        id: 2,
        name: 'Yandex',
        description: 'Yandex',
        created_at: new Date,
        updated_at: new Date,
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('company', null, {});
  }
};
