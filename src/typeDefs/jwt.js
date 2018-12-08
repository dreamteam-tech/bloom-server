const { gql } = require('apollo-server');

module.exports = gql`
  type Jwt {
    refreshToken: String!
    accessToken: String!
  }
`;
