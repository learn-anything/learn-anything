// TODO: https://github.com/learn-anything/learn-anything.xyz/issues/66
// currently we start grafbase server then go to the schema and manually copy it here
// so https://github.com/SaltyAom/mobius graphql client is type safe
// its very annoying and should be automatic
export const grafbaseTypeDefs = `
"""
De-prioritizes a fragment, causing the fragment to be omitted in the initial response and delivered as a subsequent response afterward.
"""
directive @defer(
  """When true fragment may be deferred"""
  if: Boolean! = true

  """
  This label should be used by GraphQL clients to identify the data from patch responses and associate it with the correct fragment.
  """
  label: String
) on INLINE_FRAGMENT | FRAGMENT_SPREAD

"""Indicates that an input object is a oneOf input object"""
directive @oneOf on INPUT_OBJECT

type CompletedLink {
  id: String!
  title: String!
  url: String!
}

type GlobalLink {
  id: String!
  title: String!
  url: String!
  protocol: String!
  year: String
  description: String
}

type LikedLink {
  id: String!
  title: String!
  url: String!
}

type Mutation {
  createUser(email: String!): String!
  deletePersonalLink(personalLinkId: String!): String!
  updateTopicLearningStatus(learningStatus: learningStatus!, topicName: String!, verifiedTopic: Boolean!): String!
  updateLinkStatusResolver(linkId: String!, action: linkAction!): String!
  updateGlobalLinkStatus(action: globalLinkAction!, globalLinkId: String!): String!
  addPersonalLink(title: String!, url: String!, description: String): String!
  cancelStripe: String!
  renewStripe: String!
  updateStripePlan: String!
  internalUpdateMemberUntilOfUser(email: String!, memberUntilDateInUnixTime: Int!, stripeSubscriptionObjectId: String!, stripePlan: String!): String!
  internalUpdateGrafbaseKv(topicsWithConnections: [updateGrafbaseKvOutput!]!): String!
  internalUpdateLatestGlobalGuide(topicName: String!, topicSummary: String!, sections: [section!]!): String!
  internalAddGlobalLinkToSection(linkUrl: String!, topicName: String!, sectionName: String!): String!
}

type PersonalLink {
  id: String!
  title: String!
  url: String!
}

type Query {
  publicGetTopicsWithConnections: [publicGetTopicsWithConnectionsOutput!]!
  publicGetGlobalTopics: [publicGetGlobalTopicsOutput!]!
  publicGetGlobalTopic(topicName: String!): publicGetGlobalTopicOutput!
  getUserDetails: getUserDetailsOutput!
  getPricingUserDetails: getPricingUserDetailsOutput!
  getNotesForGlobalTopic(topicName: String!): [globalNote!]!
  getLikedLinks: outputOfGetLikedLinks!
  getTopicsLearned: getTopicsLearnedOutput!
  getGlobalLink(linkId: String!): publicGetGlobalLinkOutput!
  getGlobalTopic(topicName: String!): getGlobalTopicOutput!
  getGlobalTopicLearningStatus(topicName: String!): String!
  getGlobalLinks: getGlobalLinksOutput!
  checkUrl(linkUrl: String!): String!
  stripe(plan: String!, userEmail: String!): String!
}

type getGlobalLinksOutput {
  id: String!
  title: String!
  url: String!
}

type getGlobalTopicOutput {
  learningStatus: learningStatus!
  likedLinkIds: [String!]!
  completedLinkIds: [String!]!
}

type getPricingUserDetailsOutput {
  stripePlan: String
  memberUntil: String
  subscriptionStopped: Boolean
}

type getTopicsLearnedOutput {
  topicsToLearn: [topicToLearn!]!
  topicsLearning: [topicToLearn!]!
  topicsLearned: [topicToLearn!]!
}

type getUserDetailsOutput {
  isMember: Boolean!
}

type globalGuideSection {
  title: String!
  summary: String
  links: [GlobalLink!]!
}

enum globalLinkAction {
  like
  unlike
  complete
  uncomplete
}

type globalNote {
  content: String!
  url: String
}

type latestGlobalGuide {
  summary: String!
  sections: [globalGuideSection!]!
}

enum learningStatus {
  to_learn
  learning
  learned
  none
}

enum linkAction {
  like
  unlike
  complete
  uncomplete
}

type outputOfGetLikedLinks {
  likedLinks: [LikedLink!]!
  completedLinks: [CompletedLink!]!
  personalLinks: [PersonalLink!]!
}

type publicGetGlobalLinkOutput {
  title: String!
  url: String!
  verified: Boolean!
  public: Boolean!
  protocol: String
  fullUrl: String
  description: String
  urlTitle: String
  year: String
}

type publicGetGlobalTopicOutput {
  prettyName: String!
  topicSummary: String!
  latestGlobalGuide: latestGlobalGuide
  links: [GlobalLink!]!
  notesCount: Int!
}

type publicGetGlobalTopicsOutput {
  prettyName: String!
  name: String!
}

type publicGetTopicsWithConnectionsOutput {
  name: String!
  prettyName: String!
  connections: [String!]!
}

input section {
  title: String!
  summary: String
  linkIds: [String!]!
}

type topicToLearn {
  name: String!
  prettyName: String!
  verified: Boolean!
}

input updateGrafbaseKvOutput {
  name: String!
  prettyName: String!
  connections: [String!]!
}
`
