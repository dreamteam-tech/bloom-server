const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    id: ID!
    phone: String!
    is_active: Boolean!
    created_at: Date!
    updated_at: Date!
  }
`;
