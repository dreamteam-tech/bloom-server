const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { JoiError } = require('./errors');
const config = require('./config/app');

module.exports = {
  resolveAuthToken(req) {
    const queryToken = (req.query || {}).token || '';
    const auth = (req.headers || {}).authorization || '';
    if (queryToken.length === 0 && auth.length === 0) {
      return null;
    }

    // Поддерживаем два вида авторизации: Bearer и вариант в лоб
    const headerToken = auth.split(' ')[0] === 'Bearer' ? auth.split(' ')[1] : auth;
    return headerToken || queryToken;
  },

  jwtVerify(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.jwt.secret, (err, decodedToken) => {
        if (err || !decodedToken) {
          return reject(err);
        }

        resolve(decodedToken);
      });
    });
  },

  filterValues(body) {
    let result = {};

    for (let key in body) {
      if (typeof body[key] === 'undefined' || body[key] === '___undefined') {
        continue;
      }

      // form enctype=multipart fix
      if (body[key] === 'null') {
        continue;
      }

      result[key] = body[key];
    }

    return result;
  },

  signRefreshToken(user) {
    return this.sign({ id: user.id }, 30);
  },

  signUser(user) {
    return this.sign({ id: user.id }, 1);
  },

  sign(data, expireInHours = 1) {
    return jwt.sign(data, config.jwt.secret, {
      expiresIn: Math.floor(Date.now() / 1000) + 60 * (60 * expireInHours)
    });
  },

  validate(data, schema, options = {}) {
    const defaultOptions = {
      abortEarly: false,
      allowUnknown: true
    };

    const { error, value } = Joi.validate(data, schema, { ...defaultOptions, ...options });

    if (error) {
      throw new JoiError(error);
    }

    return value;
  }
};
