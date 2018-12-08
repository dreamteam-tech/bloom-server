const { gql } = require('apollo-server');

module.exports = gql`
  type Transaction {
    id: ID!
    amount: Float!
    user: User!
    strategy: Strategy!
    created_at: Date!
    updated_at: Date!
  }
  
  type ChartLine {
    date: String!
    value: Float!
  }
`;
