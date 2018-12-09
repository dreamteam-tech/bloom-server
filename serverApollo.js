require('./bootstrap');
const { ApolloServer } = require('apollo-server');
const appConfig = require('./src/config/app');
const root = require('./src/root');

const server = new ApolloServer(root);
server.listen({ port: appConfig.port }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
