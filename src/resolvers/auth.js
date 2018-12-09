const Joi = require('joi');
const { AuthenticationError } = require('apollo-server');
const { JoiError } = require('../errors');
const utils = require('../utils');
const passwordUtil = require('../passwordUtil');
const models = require('../models');

const getAuthorizationPayload = (user) => ({
  refreshToken: user.refresh_token,
  accessToken: utils.signUser(user)
});

module.exports = {
  Query: {
    hello: () => 'world'
  },
  Mutation: {
    refreshToken: async (root, args, context, info) => {
      const value = utils.validate(args, {
        token: Joi.string().required()
      });

      const jwtUser = await utils.jwtVerify(value.token);

      const user = await models.User.findByPk(jwtUser.id);
      if (null === user) {
        throw new AuthenticationError('User not found');
      }

      if (user.refresh_token !== value.token) {
        throw new AuthenticationError('Invalid refresh token');
      }

      await user.update({
        refresh_token: utils.signRefreshToken(user)
      });

      return getAuthorizationPayload(user);
    },
    /**
     * Авторизация
     *
     * @param root
     * @param args
     * @param context
     * @param info
     * @returns {Promise<{id: user.id|{allowNull, autoIncrement, primaryKey, type}, permissions: Array, jwt: *}>}
     */
    login: async (root, args, context, info) => {
      const value = utils.validate(args, {
        phone: Joi.string().required().label('validation.phone'),
        password: Joi.string().min(6).max(50).required().label('validation.password'),
      });

      const user = await models.User.findOne({
        where: { phone: value.phone }
      });
      if (null === user) {
        throw new JoiError({ login: [ 'User not found' ] });
      }

      if (false === user.is_active) {
        throw new JoiError({ login: [ 'Inactive account' ] });
      }

      const valid = await passwordUtil.compare(value.password, user.password);
      if (false === valid) {
        throw new JoiError({ password: [ 'Invalid password' ] });
      }

      await user.update({
        refresh_token: utils.signRefreshToken(user)
      });

      return getAuthorizationPayload(user);
    },
    /**
     * Регистрация
     *
     * @param root
     * @param args
     * @param context
     * @param info
     * @returns {Promise<user.id|{allowNull, autoIncrement, primaryKey, type}>}
     */
    registration: async (root, args, context, info) => {
      const value = utils.validate(args, {
        phone: Joi.string().required(),
        password: Joi.string().min(6).max(50).required(),
        password_confirm: Joi.string().min(6).max(50).required().valid(Joi.ref('password')).options({
          language: {
            any: {
              allowOnly: '!!Passwords do not match'
            }
          }
        })
      });

      const count = await models.User.count({
        where: { phone: value.phone }
      });
      if (count > 0) {
        throw new JoiError({
          phone: 'Phone already taken'
        });
      }

      const user = await models.User.create({
        phone: value.phone.toLowerCase(),
        password: await passwordUtil.hash(value.password),
        token: passwordUtil.token()
      });

      // TODO sms.send(user.phone);

      return user;
    },
    /**
     * Регистрация
     *
     * @param root
     * @param args
     * @param context
     * @param info
     * @returns {Promise<user.id|{allowNull, autoIncrement, primaryKey, type}>}
     */
    registrationVkontakte: async (root, args, context, info) => {
      const value = utils.validate(args, {
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        vk_id: Joi.number().integer().positive().required()
      });

      const user = await models.User.findOne({
        where: { vk_id: value.vk_id }
      });
      if (user) {
        return user;
      }

      return await models.User.create({
        first_name: value.first_name,
        last_name: value.last_name,
        vk_id: value.vk_id,
        is_active: true,
      });
    },
    /**
     * Подтверждение регистрации
     *
     * @param root
     * @param args
     * @param context
     * @param info
     * @returns {Promise<{id: user.id|{allowNull, autoIncrement, primaryKey, type}, permissions: Array, jwt: *}>}
     */
    registrationConfirm: async (root, args, context, info) => {
      const value = utils.validate(args, {
        token: Joi.string().required()
      });

      const user = await models.User.findOne({
        where: { token: value.token.toLowerCase() }
      });
      if (null === user) {
        throw new JoiError({
          token: [ 'Invalid token' ]
        });
      }

      await user.update({
        is_active: true,
        token: null,
        refresh_token: utils.signRefreshToken(user)
      });

      return getAuthorizationPayload(user);
    },
    /**
     * Подтверждение восстановления учетной записи и изменение пароля
     * @param root
     * @param args
     * @param context
     * @param info
     * @returns {Promise<{id: Model, permissions: Array, jwt: *}>}
     */
    restoreConfirm: async (root, args, context, info) => {
      const value = utils.validate(args, {
        token: Joi.string().required(),
        password: Joi.string().required().min(6).max(50),
        password_confirm: Joi.string().required().min(6).max(50).valid(Joi.ref('password')).options({
          language: {
            any: {
              allowOnly: '!!Passwords do not match'
            }
          }
        })
      });

      const user = await models.User.findOne({
        where: { token: value.token.toLowerCase() }
      });
      if (null === user) {
        throw new JoiError({
          password: [ 'invalid token' ]
        });
      }

      if (value.password !== value.password_confirm) {
        throw new JoiError({
          password: [ 'Password not match' ]
        });
      }

      await user.update({
        // Активируем учетную запись пользователя, так как
        // восстановление учетки подразумевает отправку письма на
        // ящик пользователя, что само сабой подразумевает подтверждение
        // ящика электронной почты пользователя
        is_active: true,
        // Обнуляем токен воизбежание переиспользования
        token: null,
        password: await passwordUtil.hash(value.password),
        refresh_token: utils.signRefreshToken(user)
      });

      return getAuthorizationPayload(user);
    },

    /**
     * Проверка кода восстановления
     * @param root
     * @param args
     * @param context
     * @param info
     * @returns boolean
     */
    restoreCheck: async (root, args, context, info) => {
      const value = utils.validate(args, {
        token: Joi.string().required()
      });

      const count = await models.User.count({
        where: { token: value.token.toLowerCase() }
      });

      if (count === 0) {
        throw new JoiError({
          token: ['Не корректный код']
        })
      }

      return true;
    },

    /**
     * Восстановление пароля
     * @param root
     * @param args
     * @param context
     * @param info
     * @returns {Promise<null>}
     */
    restore: async (root, args, context, info) => {
      const value = utils.validate(args, {
        phone: Joi.string().required()
      });

      const user = await models.User.findOne({
        where: { phone: value.phone }
      });
      if (null === user) {
        throw new JoiError({ email: [ 'User not found' ] });
      }

      if (null === user.token) {
        await user.update({ token: passwordUtil.token() });
      }

      // TODO send sms
      // await utils.mailSend(user.email, 'user_restore', { user });

      return null;
    },

    /**
     * Восстановление пароля
     * @param root
     * @param args
     * @param context
     * @param info
     * @returns {Promise<null>}
     */
    changePassword: async (root, args, context, info) => {
      const value = utils.validate(args, {
        password: Joi.string().required().min(6).max(50),
        password_confirm: Joi.string().required().min(6).max(50).valid(Joi.ref('password')).options({
          language: {
            any: {
              allowOnly: '!!Passwords do not match'
            }
          }
        })
      });

      return await context.currentUser.update({
        password: await passwordUtil.hash(value.password)
      });
    }
  }
};
