require('./bootstrap');
const { ApolloServer } = require('apollo-server');
const root = require('./src/root');

const server = new ApolloServer(root);
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
