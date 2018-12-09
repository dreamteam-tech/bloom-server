const { gql } = require('apollo-server');

module.exports = gql`
  type Dashboard {
    invested: Float!
    amount: Float!
    percent: Float!
    balance: Float!
    strategy: Strategy!
    chart: [ChartLine!]
  }
`;
