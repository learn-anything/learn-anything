export const grafbaseTypeDefs = `
type GlobalLink {
  id: String!
  title: String!
  url: String!
  year: String
  protocol: String!
  description: String
  mainTopic: MainTopicWithTitleAndPrettyName
}
type MainTopicWithTitleAndPrettyName {
  name: String!
  prettyName: String!
}
type Mutation {
  createUser(email: String!): String!
  updateTopicOfWiki(topicName: String!, prettyName: String!, content: String!, published: Boolean!, topicPath: String!): String!
  createProduct(name: String!, description: String, imageUrl: String, websiteUrl: String, priceInUsdCents: Int): String!
  deletePersonalLink(personalLinkId: String!): String!
  updateTopicLearningStatus(learningStatus: learningStatus!, topicName: String!, verifiedTopic: Boolean!): String!
  updateGlobalLinkStatus(action: globalLinkAction!, globalLinkId: String!): String!
  addPersonalLink(url: String!, title: String!, description: String!, mainTopic: String!, linkState: linkState!, liked: Boolean!): String!
  cancelStripe: String!
  renewStripe: String!
  updateStripePlan: String!
  internalUpdateMemberUntilOfUser(email: String!, memberUntilDateInUnixTime: Int!, stripeSubscriptionObjectId: String!, stripePlan: String!): String!
  internalUpdateGrafbaseKv(topicsWithConnections: [updateGrafbaseKvOutput!]!): String!
  internalUpdateLatestGlobalGuide(topicName: String!, topicSummary: String!, sections: [section!]!): String!
  internalAddGlobalLinkToSection(linkUrl: String!, topicName: String!, sectionName: String!): String!
}
type PersonalLink {
  title: String
  description: String
  mainTopic: MainTopicWithTitleAndPrettyName
  globalLink: GlobalLink!
}
type Query {
  publicGetTopicsWithConnections: [publicGetTopicsWithConnectionsOutput!]!
  publicGetGlobalTopics: [publicGetGlobalTopicsOutput!]!
  publicGetPersonalTopic(topicName: String!, user: String!): [publicGetPersonalTopicOutput!]!
  publicGetGlobalTopic(topicName: String!): publicGetGlobalTopicOutput!
  getUserDetails: getUserDetailsOutput!
  getPricingUserDetails: getPricingUserDetailsOutput!
  getNotesForGlobalTopic(topicName: String!): [globalNote!]!
  getAllLinks: outputOfGetAllLinks!
  getTopicsLearned: getTopicsLearnedOutput!
  getGlobalLink(linkId: String!): publicGetGlobalLinkOutput!
  getGlobalTopic(topicName: String!): getGlobalTopicOutput!
  getGlobalTopicLearningStatus(topicName: String!): String!
  getGlobalLinks: getGlobalLinksOutput!
  checkUrl(linkUrl: String!): String!
  getStripeDashboard: String!
  stripe(plan: String!, userEmail: String!): String!
}
type getGlobalLinksOutput {
  id: String!
  title: String!
  url: String!
}
type getGlobalTopicOutput {
  learningStatus: String!
  linksBookmarkedIds: [String!]!
  linksInProgressIds: [String!]!
  linksCompletedIds: [String!]!
  linksLikedIds: [String!]!
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
  summary: String
  title: String!
  links: [GlobalLink!]!
}
type globalNote {
  content: String!
  url: String
}
type latestGlobalGuide {
  sections: [globalGuideSection!]!
}
type outputOfGetAllLinks {
  linksBookmarked: [PersonalLink!]!
}
type publicGetGlobalLinkOutput {
  title: String!
  url: String!
  verified: Boolean!
  public: Boolean!
  protocol: String!
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
type publicGetPersonalTopicOutput {
  prettyName: String!
  content: String!
  public: Boolean!
  topicPath: String!
}
type publicGetTopicsWithConnectionsOutput {
  name: String!
  prettyName: String!
  connections: [String!]!
}
type topicToLearn {
  name: String!
  prettyName: String!
  verified: Boolean!
}
enum globalLinkAction {
  removeProgress
  bookmark
  inProgress
  complete
  like
  unlike
}
enum learningStatus {
  to_learn
  learning
  learned
  none
}
enum linkState {
  Bookmark
  InProgress
  Completed
  None
}
input section {
  title: String!
  summary: String
  linkIds: [String!]!
}
input updateGrafbaseKvOutput {
  name: String!
  prettyName: String!
  connections: [String!]!
}
`