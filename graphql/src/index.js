// @flow

import { ApolloServer } from 'apollo-server';

import Schema from './Schema';
import GraphQLContext from './GraphQLContext';

const port = 4000;
const startServer = async () => {
  const server = new ApolloServer({
    schema: Schema,
    context: GraphQLContext,
    tracing: true,
  });

  server.listen(port).then(({ url }) => {
    console.log(`GraphQL server ready at ${url}`); // eslint-disable-line no-console
  });
};

startServer().catch((error: Error) => {
  console.error(error); // eslint-disable-line no-console
});
