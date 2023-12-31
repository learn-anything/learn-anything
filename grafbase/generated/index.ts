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
  'globalLinkAction': | 'removeProgress'| 'bookmark'| 'inProgress'| 'complete'| 'like'| 'unlike';
  'linkState': | 'Bookmark'| 'InProgress'| 'Completed'| 'None';
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
  'publicGetPersonalTopicOutput': {
    __typename?: 'publicGetPersonalTopicOutput';
    prettyName: string;
    content: string;
    public: boolean;
    topicPath: string;
  };
  'MainTopicWithTitleAndPrettyName': {
    __typename?: 'MainTopicWithTitleAndPrettyName';
    name: string;
    prettyName: string;
  };
  'GlobalLink': {
    __typename?: 'GlobalLink';
    id: string;
    title: string;
    url: string;
    year: string | null;
    protocol: string;
    description: string | null;
    mainTopic?: Schema['MainTopicWithTitleAndPrettyName'];
  };
  'globalGuideSection': {
    __typename?: 'globalGuideSection';
    summary: string | null;
    title: string;
    links?: Array<Schema['GlobalLink']>;
  };
  'latestGlobalGuide': {
    __typename?: 'latestGlobalGuide';
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
  'outputOfGetAllLinks': {
    __typename?: 'outputOfGetAllLinks';
    linksBookmarked?: Array<Schema['GlobalLink']>;
    linksInProgress?: Array<Schema['GlobalLink']>;
    linksCompleted?: Array<Schema['GlobalLink']>;
    linksLiked?: Array<Schema['GlobalLink']>;
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
    protocol: string;
    fullUrl: string | null;
    description: string | null;
    urlTitle: string | null;
    year: string | null;
  };
  'getGlobalTopicOutput': {
    __typename?: 'getGlobalTopicOutput';
    learningStatus: string;
    linksBookmarkedIds: Array<string>;
    linksInProgressIds: Array<string>;
    linksCompletedIds: Array<string>;
    linksLikedIds: Array<string>;
  };
  'getGlobalLinksOutput': {
    __typename?: 'getGlobalLinksOutput';
    id: string;
    title: string;
    url: string;
  };
  'Query': {
    __typename?: 'Query';
    publicGetTopicsWithConnections?: Array<Schema['publicGetTopicsWithConnectionsOutput']>;
    publicGetGlobalTopics?: Array<Schema['publicGetGlobalTopicsOutput']>;
    publicGetPersonalTopic?: Array<Schema['publicGetPersonalTopicOutput']>;
    publicGetGlobalTopic?: Schema['publicGetGlobalTopicOutput'];
    getUserDetails?: Schema['getUserDetailsOutput'];
    getPricingUserDetails?: Schema['getPricingUserDetailsOutput'];
    getNotesForGlobalTopic?: Array<Schema['globalNote']>;
    getAllLinks?: Schema['outputOfGetAllLinks'];
    getTopicsLearned?: Schema['getTopicsLearnedOutput'];
    getGlobalLink?: Schema['publicGetGlobalLinkOutput'];
    getGlobalTopic?: Schema['getGlobalTopicOutput'];
    getGlobalTopicLearningStatus?: string;
    getGlobalLinks?: Schema['getGlobalLinksOutput'];
    checkUrl?: string;
    getStripeDashboard?: string;
    stripe?: string;
  };
  'Mutation': {
    __typename?: 'Mutation';
    createUser?: string;
    updateTopicOfWiki?: string;
    createProduct?: string;
    deletePersonalLink?: string;
    updateTopicLearningStatus?: string;
    updateGlobalLinkStatus?: string;
    addPersonalLink?: string;
    cancelStripe?: string;
    renewStripe?: string;
    updateStripePlan?: string;
    internalUpdateMemberUntilOfUser?: string;
    internalUpdateGrafbaseKv?: string;
    internalUpdateLatestGlobalGuide?: string;
    internalAddGlobalLinkToSection?: string;
  };
};

import { ResolverFn } from '@grafbase/sdk'

export type Resolver = {
  'Query.publicGetTopicsWithConnections': ResolverFn<Schema['Query'], {  }, Array<Schema['publicGetTopicsWithConnectionsOutput']>>
  'Query.publicGetGlobalTopics': ResolverFn<Schema['Query'], {  }, Array<Schema['publicGetGlobalTopicsOutput']>>
  'Query.publicGetPersonalTopic': ResolverFn<Schema['Query'], { topicName: string, user: string,  }, Array<Schema['publicGetPersonalTopicOutput']>>
  'Query.publicGetGlobalTopic': ResolverFn<Schema['Query'], { topicName: string,  }, Schema['publicGetGlobalTopicOutput']>
  'Query.getUserDetails': ResolverFn<Schema['Query'], {  }, Schema['getUserDetailsOutput']>
  'Query.getPricingUserDetails': ResolverFn<Schema['Query'], {  }, Schema['getPricingUserDetailsOutput']>
  'Query.getNotesForGlobalTopic': ResolverFn<Schema['Query'], { topicName: string,  }, Array<Schema['globalNote']>>
  'Query.getAllLinks': ResolverFn<Schema['Query'], {  }, Schema['outputOfGetAllLinks']>
  'Query.getTopicsLearned': ResolverFn<Schema['Query'], {  }, Schema['getTopicsLearnedOutput']>
  'Query.getGlobalLink': ResolverFn<Schema['Query'], { linkId: string,  }, Schema['publicGetGlobalLinkOutput']>
  'Query.getGlobalTopic': ResolverFn<Schema['Query'], { topicName: string,  }, Schema['getGlobalTopicOutput']>
  'Query.getGlobalTopicLearningStatus': ResolverFn<Schema['Query'], { topicName: string,  }, string>
  'Query.getGlobalLinks': ResolverFn<Schema['Query'], {  }, Schema['getGlobalLinksOutput']>
  'Query.checkUrl': ResolverFn<Schema['Query'], { linkUrl: string,  }, string>
  'Query.getStripeDashboard': ResolverFn<Schema['Query'], {  }, string>
  'Query.stripe': ResolverFn<Schema['Query'], { plan: string, userEmail: string,  }, string>
  'Mutation.createUser': ResolverFn<Schema['Mutation'], { email: string,  }, string>
  'Mutation.updateTopicOfWiki': ResolverFn<Schema['Mutation'], { topicName: string, prettyName: string, content: string, published: boolean, topicPath: string,  }, string>
  'Mutation.createProduct': ResolverFn<Schema['Mutation'], { name: string, description: string | null, imageUrl: string | null, websiteUrl: string | null, priceInUsdCents: number | null,  }, string>
  'Mutation.deletePersonalLink': ResolverFn<Schema['Mutation'], { personalLinkId: string,  }, string>
  'Mutation.updateTopicLearningStatus': ResolverFn<Schema['Mutation'], { learningStatus: Schema['learningStatus'], topicName: string, verifiedTopic: boolean,  }, string>
  'Mutation.updateGlobalLinkStatus': ResolverFn<Schema['Mutation'], { action: Schema['globalLinkAction'], globalLinkId: string,  }, string>
  'Mutation.addPersonalLink': ResolverFn<Schema['Mutation'], { url: string, title: string, description: string, mainTopic: string, linkState: Schema['linkState'], liked: boolean,  }, string>
  'Mutation.cancelStripe': ResolverFn<Schema['Mutation'], {  }, string>
  'Mutation.renewStripe': ResolverFn<Schema['Mutation'], {  }, string>
  'Mutation.updateStripePlan': ResolverFn<Schema['Mutation'], {  }, string>
  'Mutation.internalUpdateMemberUntilOfUser': ResolverFn<Schema['Mutation'], { email: string, memberUntilDateInUnixTime: number, stripeSubscriptionObjectId: string, stripePlan: string,  }, string>
  'Mutation.internalUpdateGrafbaseKv': ResolverFn<Schema['Mutation'], { topicsWithConnections: Array<Schema['updateGrafbaseKvOutput']>,  }, string>
  'Mutation.internalUpdateLatestGlobalGuide': ResolverFn<Schema['Mutation'], { topicName: string, topicSummary: string, sections: Array<Schema['section']>,  }, string>
  'Mutation.internalAddGlobalLinkToSection': ResolverFn<Schema['Mutation'], { linkUrl: string, topicName: string, sectionName: string,  }, string>
}

