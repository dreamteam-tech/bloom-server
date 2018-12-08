const { gql } = require('apollo-server');

module.exports = gql`
  directive @auth(roles: [String]) on FIELD_DEFINITION
`;
