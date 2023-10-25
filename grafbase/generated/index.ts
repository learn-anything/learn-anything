// This is a generated file. It should not be edited manually.
//
// You can decide to commit this file or add it to your `.gitignore`.
//
// By convention, this module is imported as `@grafbase/generated`. To make this syntax possible,
// add a `paths` entry to your `tsconfig.json`.
//
//  "compilerOptions": {
//    "paths": {
//      "@grafbase/generated": ["./grafbase/generated"]
//    }
//  }

export type Schema = {
  'learningStatus': | 'to_learn'| 'learning'| 'learned'| 'none';
  'linkAction': | 'like'| 'unlike'| 'complete'| 'uncomplete';
  'globalLinkAction': | 'like'| 'unlike'| 'complete'| 'uncomplete';
  'section': {
    title: string;
    summary: string | null;
    linkIds: Array<string>;
  };
  'updateGrafbaseKvOutput': {
    name: string;
    prettyName: string;
    connections: Array<string>;
  };
  'publicGetTopicsWithConnectionsOutput': {
    __typename?: 'publicGetTopicsWithConnectionsOutput';
    name: string;
    prettyName: string;
    connections: Array<string>;
  };
  'publicGetGlobalTopicsOutput': {
    __typename?: 'publicGetGlobalTopicsOutput';
    prettyName: string;
    name: string;
  };
  'GlobalLink': {
    __typename?: 'GlobalLink';
    id: string;
    title: string;
    url: string;
    protocol: string;
    year: string | null;
    description: string | null;
  };
  'globalGuideSection': {
    __typename?: 'globalGuideSection';
    title: string;
    summary: string | null;
    links?: Array<Schema['GlobalLink']>;
  };
  'latestGlobalGuide': {
    __typename?: 'latestGlobalGuide';
    summary: string;
    sections?: Array<Schema['globalGuideSection']>;
  };
  'publicGetGlobalTopicOutput': {
    __typename?: 'publicGetGlobalTopicOutput';
    prettyName: string;
    topicSummary: string;
    latestGlobalGuide?: Schema['latestGlobalGuide'] | null;
    links?: Array<Schema['GlobalLink']>;
    notesCount: number;
  };
  'getUserDetailsOutput': {
    __typename?: 'getUserDetailsOutput';
    isMember: boolean;
  };
  'getPricingUserDetailsOutput': {
    __typename?: 'getPricingUserDetailsOutput';
    stripePlan: string | null;
    memberUntil: string | null;
    subscriptionStopped: boolean | null;
  };
  'globalNote': {
    __typename?: 'globalNote';
    content: string;
    url: string | null;
  };
  'LikedLink': {
    __typename?: 'LikedLink';
    id: string;
    title: string;
    url: string;
  };
  'CompletedLink': {
    __typename?: 'CompletedLink';
    id: string;
    title: string;
    url: string;
  };
  'PersonalLink': {
    __typename?: 'PersonalLink';
    id: string;
    title: string;
    url: string;
  };
  'outputOfGetLikedLinks': {
    __typename?: 'outputOfGetLikedLinks';
    likedLinks?: Array<Schema['LikedLink']>;
    completedLinks?: Array<Schema['CompletedLink']>;
    personalLinks?: Array<Schema['PersonalLink']>;
  };
  'topicToLearn': {
    __typename?: 'topicToLearn';
    name: string;
    prettyName: string;
    verified: boolean;
  };
  'getTopicsLearnedOutput': {
    __typename?: 'getTopicsLearnedOutput';
    topicsToLearn?: Array<Schema['topicToLearn']>;
    topicsLearning?: Array<Schema['topicToLearn']>;
    topicsLearned?: Array<Schema['topicToLearn']>;
  };
  'publicGetGlobalLinkOutput': {
    __typename?: 'publicGetGlobalLinkOutput';
    title: string;
    url: string;
    verified: boolean;
    public: boolean;
    protocol: string | null;
    fullUrl: string | null;
    description: string | null;
    urlTitle: string | null;
    year: string | null;
  };
  'getGlobalTopicOutput': {
    __typename?: 'getGlobalTopicOutput';
    learningStatus: Schema['learningStatus'];
    likedLinkIds: Array<string>;
    completedLinkIds: Array<string>;
  };
  'getGlobalLinksOutput': {
    __typename?: 'getGlobalLinksOutput';
    id: string;
    title: string;
    url: string;
  };
};
