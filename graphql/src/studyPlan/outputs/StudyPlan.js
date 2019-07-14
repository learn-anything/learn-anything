// @flow

import { GraphQLObjectType, GraphQLString } from 'graphql';

import type { StudyPlanType } from '../DataLoader';

export default new GraphQLObjectType({
  name: 'StudyPlan',
  fields: {
    title: {
      type: GraphQLString,
      resolve: ({ title }: StudyPlanType): string => title,
    },
    description: {
      type: GraphQLString,
      resolve: ({ description }: StudyPlanType): string => description,
    },
    author: {
      type: GraphQLString,
      resolve: ({ author }: StudyPlanType): string => author && author.userName,
    },
  },
});
