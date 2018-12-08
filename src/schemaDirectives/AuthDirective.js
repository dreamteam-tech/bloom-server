const { AuthenticationError } = require('apollo-server');
const { SchemaDirectiveVisitor } = require('graphql-tools');
const { defaultFieldResolver } = require('graphql');
const utils = require('../utils');
const models = require('../models');

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;

    field.resolve = async function (...args) {
      const [, , context] = args;

      const { req } = context;

      const authToken = utils.resolveAuthToken(req);
      if (!authToken) {
        throw new AuthenticationError('No jwt token provided');
      }

      let jwtUser;
      try {
        jwtUser = await utils.jwtVerify(authToken);
      } catch (e) {
        throw new AuthenticationError('Authentication required');
      }

      const user = await models.User.findByPk(jwtUser.id);
      if (null === user) {
        throw new AuthenticationError('User not found');
      }

      context.currentUser = user;
      return resolve.apply(this, args);
    }
  }
}

module.exports = AuthDirective;