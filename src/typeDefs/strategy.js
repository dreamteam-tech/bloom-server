const { gql } = require('apollo-server');

module.exports = gql`
  type Strategy {
    id: ID!
    name: String!
    description: String!
    color: String!
    position: Int!
    has_investments: Boolean!
    percent: Float!
    companies: [StrategyCompany!]
    transactions: [Transaction]
  }
`;
