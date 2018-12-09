const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    id: ID!
    first_name: String!
    last_name: String!
    phone: String
    token: String
    vk_id: Int
    is_active: Boolean!
    created_at: Date!
    updated_at: Date!
  }
`;
