const { gql } = require('apollo-server');

module.exports = gql`
  type Strategy {
    id: ID!
    name: String!
    description: String!
    percent: Float!
    companies: [Company!]
    transactions: [Transaction]
  }
`;
