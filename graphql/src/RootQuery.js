// @flow

import { GraphQLObjectType } from 'graphql';
import StudyPlan from './studyPlan/queries/StudyPlan';

export default new GraphQLObjectType({
  name: 'RootQuery',
  description: 'Root Query',
  fields: {
    studyPlan: StudyPlan,
  },
});
