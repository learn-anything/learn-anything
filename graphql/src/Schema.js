// @flow

import { GraphQLSchema } from 'graphql';

import RootQuery from './RootQuery';
import RootMutation from './RootMutation';

export default new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
