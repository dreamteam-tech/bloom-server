const bcrypt = require('bcrypt');
const config = require('./config/app');

module.exports = {
  /**
   * Создание хеша пароля
   *
   * @param password
   * @returns {string}
   */
  hash(password) {
    return bcrypt.hash(password, config.security.rounds);
  },

  /**
   * Сравнение пароля с хешем
   *
   * @param password
   * @param hash
   * @returns bool
   */
  compare(password, hash) {
    return bcrypt.compare(password, hash);
  },

  /**
   * Генерация случайной последовательности
   * для user.token и аналогов
   *
   * @returns {string}
   */
  token(length = 6) {
    const chars = '0123456789';

    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
};
