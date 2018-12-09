const { gql } = require('apollo-server');

module.exports = gql`
  type Query {
    hello: String!

    me: User! @auth
    
    # Dashboard
    dashboard: [Dashboard!]

    # Strategies
    strategies: [Strategy!]
    strategy(id: ID!): Strategy!
    
    # Transactions
    transactions(strategy_id: ID): [Transaction!]
    transaction(id: ID!): Transaction!
    transactionChart(strategy_id: ID!): [ChartLine!]

    # Users
    users: [User!]
    user(id: ID!): User!
  }

  type Mutation {
    # Auth
    login(phone: String, password: String): Jwt!
    refreshToken(token: String): Jwt!
    restore(phone: String): ID
    restoreCheck(token: String): Boolean
    restoreConfirm(token: String, password: String, password_confirm: String): Jwt!
    registration(phone: String, password: String, password_confirm: String): User!
    registrationConfirm(token: String): Jwt!
    changePassword(password: String, password_confirm: String): Boolean!
    registrationVkontakte(first_name: String, last_name: String, vk_id: ID): Jwt!

    # Strategy
    strategyCreate(name: String, color: String, description: String, percent: Float): Strategy!
    strategyUpdate(id: ID!, color: String, name: String, description: String, percent: Float): Strategy!
    strategyRemove(id: ID!): Boolean!
    
    # Transaction
    transactionCreate(amount: Float, user_id: ID, strategy_id: ID): Transaction!
    transactionUpdate(id: ID!, amount: Float, user_id: ID, strategy_id: ID): Transaction!
    transactionRemove(id: ID!): Boolean!
  }
`;
