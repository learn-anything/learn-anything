// @flow

import { GraphQLObjectType, GraphQLString } from 'graphql';

export default new GraphQLObjectType({
  name: 'RootMutation',
  description: 'Root Mutation',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => 'This is a mutation.',
    },
  },
});
