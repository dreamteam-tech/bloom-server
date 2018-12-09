const { gql } = require('apollo-server');

module.exports = gql`
  type Dashboard {
    invested: Float!
    amount: Float!
    percent: Float!
    strategy: Strategy!
    chart: [ChartLine!]
  }
`;
