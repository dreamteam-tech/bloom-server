const schemaDirectives = require('./schemaDirectives');
const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');

module.exports = {
  debug: false,
  typeDefs,
  resolvers,
  schemaDirectives,
  context: ({ req }) => ({ req })
};
