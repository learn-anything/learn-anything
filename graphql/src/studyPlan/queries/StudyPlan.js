// @flow

import { GraphQLNonNull, GraphQLList, GraphQLString } from 'graphql';

import StudyPlan from '../outputs/StudyPlan';
import type { StudyPlanType } from '../DataLoader';
import type { GraphQLContextType } from '../../GraphQLContext';

type ArgsType = {
  query: string,
};

const Args = {
  query: {
    type: GraphQLNonNull(GraphQLString),
  },
};

export default {
  type: GraphQLList(StudyPlan),
  args: Args,
  resolve: async (
    ancestor: mixed,
    { query }: ArgsType,
    { dataLoaders }: GraphQLContextType,
  ): Promise<$ReadOnlyArray<StudyPlanType>> => {
    return dataLoaders.studyPlan.search(query);
  },
};
