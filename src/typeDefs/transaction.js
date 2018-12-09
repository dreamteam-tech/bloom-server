const { gql } = require('apollo-server');

module.exports = gql`
  type Transaction {
    id: ID!
    amount: Float!
    user: User!
    type: Int!
    is_confirmed: Boolean!
    strategy_id: Int!
    strategy: Strategy!
    created_at: Date!
    updated_at: Date!
  }
  
  type ChartLine {
    date: String!
    value: Float!
  }
`;
