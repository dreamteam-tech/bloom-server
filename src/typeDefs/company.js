const { gql } = require('apollo-server');

module.exports = gql`
  type Company {
    id: ID!
    name: String!
    description: String!
  }
`;
