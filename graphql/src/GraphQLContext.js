// @flow

import { ApolloServer } from 'apollo-server';
import StudyPlan from './studyPlan/DataLoader';

export type GraphQLContextType = {|
  +dataLoaders: {
    studyPlan: StudyPlan,
  },
|};

export default async (server: ApolloServer): Promise<GraphQLContextType> => {
  if (server.connection) {
    throw Error('Subscription not supported.');
  }

  // TODO - Authorization header will be checked here and added to context.
  return {
    dataLoaders: {
      studyPlan: new StudyPlan(),
    },
  };
};
