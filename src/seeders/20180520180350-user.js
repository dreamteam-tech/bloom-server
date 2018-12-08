const password = require('../passwordUtil');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('user', null, {});
    await queryInterface.bulkInsert('user', [
      {
        phone: '79009006666',
        password: await password.hash('79009006666'),
        is_active: true,
        is_trader: false,
        is_admin: true,
        created_at: new Date,
        updated_at: new Date,
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('user', null, {});
  }
};
