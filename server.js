require('./bootstrap');
const { ApolloServer } = require('apollo-server');
const root = require('./src/root');

const port = process.env.PORT || 4000;

const server = new ApolloServer(root);
server.listen({ port }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
