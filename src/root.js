const schemaDirectives = require('./schemaDirectives');
const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');

module.exports = {
  debug: process.env.NODE_ENV === 'production',
  typeDefs,
  resolvers,
  schemaDirectives,
  context: ({ req }) => ({ req }),
  // https://www.apollographql.com/docs/apollo-server/features/graphql-playground.html
  introspection: true,
  playground: true,
};
