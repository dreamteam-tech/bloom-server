const { gql } = require('apollo-server');

module.exports = gql`
  type Query {
    hello: String!

    me: User! @auth

    # Strategies
    strategies: [Strategy!]
    strategy(id: ID!): [Strategy!]

    # Users
    users: [User!] @auth
    user(id: ID!): User! @auth
  }

  type Mutation {
    # Auth
    login(phone: String, password: String): Jwt!
    refreshToken(token: String): Jwt!
    restore(phone: String): ID
    restoreCheck(token: String): Boolean
    restoreConfirm(token: String, password: String, password_confirm: String): Jwt!
    registration(phone: String, password: String, password_confirm: String): ID
    registrationConfirm(token: String): Jwt!
    changePassword(password: String, password_confirm: String): Boolean!

    # Strategy
    strategyCreate(name: String, description: String, percent: Float): Strategy! @auth
    strategyUpdate(id: ID!, name: String, description: String, percent: Float): Strategy! @auth
    strategyRemove(id: ID!): Boolean! @auth
  }
`;
