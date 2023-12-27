import { config, g } from "@grafbase/sdk"
export default config({
  schema: g,
  experimental: {
    kv: true,
    codegen: true
  },
  auth: {
    rules: (rules) => {
      rules.public()
    }
  }
})

// definitions
const learningStatus = g.enum("learningStatus", [
  "to_learn",
  "learning",
  "learned",
  "none"
])

// public queries
g.query("publicGetTopicsWithConnections", {
  args: {},
  returns: g
    .ref(
      g.type("publicGetTopicsWithConnectionsOutput", {
        name: g.string(),
        prettyName: g.string(),
        connections: g.string().list()
      })
    )
    .list(),
  resolver: "public/getTopicsWithConnections"
})
g.query("publicGetGlobalTopics", {
  args: {},
  returns: g
    .ref(
      g.type("publicGetGlobalTopicsOutput", {
        prettyName: g.string(),
        name: g.string()
      })
    )
    .list(),
  resolver: "public/getGlobalTopics"
})
g.query("publicGetPersonalTopic", {
  args: { topicName: g.string(), user: g.string() },
  returns: g
    .ref(
      g.type("publicGetPersonalTopicOutput", {
        prettyName: g.string(),
        content: g.string(),
        public: g.boolean(),
        topicPath: g.string()
      })
    )
    .list(),
  resolver: "public/getPersonalTopic"
})

const MainTopicWithTitleAndPrettyName = g.type(
  "MainTopicWithTitleAndPrettyName",
  {
    name: g.string(),
    prettyName: g.string()
  }
)

const GlobalLink = g.type("GlobalLink", {
  id: g.string(),
  title: g.string(),
  url: g.string(),
  year: g.string().optional(),
  protocol: g.string(),
  description: g.string().optional(),
  mainTopic: g.ref(MainTopicWithTitleAndPrettyName)
})
const globalGuideSection = g.type("globalGuideSection", {
  summary: g.string().optional(),
  title: g.string(),
  links: g.ref(GlobalLink).list()
})
const latestGlobalGuide = g.type("latestGlobalGuide", {
  sections: g.ref(globalGuideSection).list()
})
g.query("publicGetGlobalTopic", {
  args: { topicName: g.string() },
  returns: g.ref(
    g.type("publicGetGlobalTopicOutput", {
      prettyName: g.string(),
      topicSummary: g.string(),
      latestGlobalGuide: g.ref(latestGlobalGuide).optional(),
      links: g.ref(GlobalLink).list(),
      notesCount: g.int()
    })
  ),
  resolver: "public/getGlobalTopic"
})

// auth queries
g.query("getUserDetails", {
  args: {},
  returns: g.ref(
    g.type("getUserDetailsOutput", {
      isMember: g.boolean()
    })
  ),
  resolver: "getUserDetails"
})

g.query("getPricingUserDetails", {
  args: {},
  returns: g.ref(
    g.type("getPricingUserDetailsOutput", {
      stripePlan: g.string().optional(),
      memberUntil: g.string().optional(),
      subscriptionStopped: g.boolean().optional()
    })
  ),
  resolver: "getPricingUserDetails"
})

const globalNote = g.type("globalNote", {
  content: g.string(),
  url: g.string().optional()
})
g.query("getNotesForGlobalTopic", {
  args: { topicName: g.string() },
  returns: g.ref(globalNote).list(),
  resolver: "getNotesForGlobalTopic"
})

g.query("getAllLinks", {
  args: {},
  returns: g.ref(
    g.type("outputOfGetAllLinks", {
      linksBookmarked: g.ref(GlobalLink).list(),
      linksInProgress: g.ref(GlobalLink).list(),
      linksCompleted: g.ref(GlobalLink).list(),
      linksLiked: g.ref(GlobalLink).list()
    })
  ),
  resolver: "getAllLinks"
})

const topicToLearn = g.type("topicToLearn", {
  name: g.string(),
  prettyName: g.string(),
  verified: g.boolean()
})
g.query("getTopicsLearned", {
  args: {},
  returns: g.ref(
    g.type("getTopicsLearnedOutput", {
      topicsToLearn: g.ref(topicToLearn).list(),
      topicsLearning: g.ref(topicToLearn).list(),
      topicsLearned: g.ref(topicToLearn).list()
    })
  ),
  resolver: "getTopicsLearned"
})

g.query("getGlobalLink", {
  args: { linkId: g.string() },
  returns: g.ref(
    g.type("publicGetGlobalLinkOutput", {
      title: g.string(),
      url: g.string(),
      verified: g.boolean(),
      public: g.boolean(),
      protocol: g.string(),
      fullUrl: g.string().optional(),
      description: g.string().optional(),
      urlTitle: g.string().optional(),
      year: g.string().optional()
    })
  ),
  resolver: "getGlobalLink"
})

g.query("getGlobalTopic", {
  args: { topicName: g.string() },
  returns: g.ref(
    g.type("getGlobalTopicOutput", {
      // learningStatus: g.enumRef(learningStatus), // TODO: edgedb-js generates string instead of enum for query
      learningStatus: g.string(),
      linksBookmarkedIds: g.string().list(),
      linksInProgressIds: g.string().list(),
      linksCompletedIds: g.string().list(),
      linksLikedIds: g.string().list()
    })
  ),
  resolver: "getGlobalTopic"
})

g.query("getGlobalTopicLearningStatus", {
  args: { topicName: g.string() },
  returns: g.string(),
  resolver: "getGlobalTopicLearningStatus"
})

g.query("getGlobalLinks", {
  args: {},
  returns: g.ref(
    g.type("getGlobalLinksOutput", {
      id: g.string(),
      title: g.string(),
      url: g.string()
    })
  ),
  resolver: "getGlobalLinks"
})

g.query("checkUrl", {
  args: { linkUrl: g.string() },
  returns: g.string(),
  resolver: "checkUrl"
})

g.query("getStripeDashboard", {
  args: {},
  returns: g.string(),
  resolver: "getStripeDashboard"
})

g.query("stripe", {
  args: { plan: g.string(), userEmail: g.string() },
  returns: g.string(),
  resolver: "stripe"
})

// TODO: figure out what should be returned from `success` and `error` on mutations (string?)
// auth mutations
g.mutation("createUser", {
  args: { email: g.string() },
  returns: g.string(),
  resolver: "createUser"
})

g.mutation("updateTopicOfWiki", {
  args: {
    topicName: g.string(),
    prettyName: g.string(),
    content: g.string(),
    published: g.boolean(),
    topicPath: g.string()
  },
  returns: g.string(),
  resolver: "updateTopicOfWiki"
})

g.mutation("createProduct", {
  args: {
    name: g.string(),
    description: g.string().optional(),
    imageUrl: g.string().optional(),
    websiteUrl: g.string().optional(),
    priceInUsdCents: g.int().optional()
  },
  returns: g.string(),
  resolver: "createProduct"
})

// TODO: delete and make it `deleteUserGlobalLink`
g.mutation("deletePersonalLink", {
  args: { personalLinkId: g.string() },
  returns: g.string(),
  resolver: "deletePersonalLink"
})

const section = g.input("section", {
  title: g.string(),
  summary: g.string().optional(),
  linkIds: g.string().list()
})

g.mutation("updateTopicLearningStatus", {
  args: {
    learningStatus: g.enumRef(learningStatus),
    topicName: g.string(),
    verifiedTopic: g.boolean()
  },
  returns: g.string(),
  resolver: "updateTopicLearningStatus"
})

const globalLinkAction = g.enum("globalLinkAction", [
  "removeProgress",
  "bookmark",
  "inProgress",
  "complete",
  "like",
  "unlike"
])
g.mutation("updateGlobalLinkStatus", {
  args: { action: g.enumRef(globalLinkAction), globalLinkId: g.string() },
  returns: g.string(),
  resolver: "updateGlobalLinkStatus"
})

g.mutation("addGlobalLink", {
  args: {
    title: g.string(),
    url: g.string(),
    description: g.string().optional()
  },
  returns: g.string(),
  resolver: "addGlobalLink"
})

g.mutation("cancelStripe", {
  args: {},
  returns: g.string(),
  resolver: "cancelStripe"
})

g.mutation("renewStripe", {
  args: {},
  returns: g.string(),
  resolver: "renewStripe"
})

g.mutation("updateStripePlan", {
  args: {},
  returns: g.string(),
  resolver: "updateStripePlan"
})

// internal
g.mutation("internalUpdateMemberUntilOfUser", {
  args: {
    email: g.string(),
    memberUntilDateInUnixTime: g.int(),
    stripeSubscriptionObjectId: g.string(),
    stripePlan: g.string()
  },
  returns: g.string(),
  resolver: "internal/updateMemberUntilOfUser"
})

g.mutation("internalUpdateGrafbaseKv", {
  args: {
    topicsWithConnections: g
      .inputRef(
        g.input("updateGrafbaseKvOutput", {
          name: g.string(),
          prettyName: g.string(),
          connections: g.string().list()
        })
      )
      .list()
  },
  returns: g.string(),
  resolver: "internal/updateGrafbaseKv"
})

g.mutation("internalUpdateLatestGlobalGuide", {
  args: {
    topicName: g.string(),
    topicSummary: g.string(),
    sections: g.inputRef(section).list()
  },
  returns: g.string(),
  resolver: "internal/updateLatestGlobalGuide"
})

g.mutation("internalAddGlobalLinkToSection", {
  args: {
    linkUrl: g.string(),
    topicName: g.string(),
    sectionName: g.string()
  },
  returns: g.string(),
  resolver: "internal/addGlobalLinkToSection"
})

// TODO: cleanup or make into correct resolvers
// g.mutation("uploadProfilePhoto", {
//   args: { image: g.string() },
//   returns: g.string(),
//   resolver: "uploadProfilePhoto",
// })
// const inputToUpdateGlobalTopic = g.input("inputToUpdateGlobalTopic", {
//   topicSummary: g.string(),
//   sections: g.inputRef(section).list(),
// })
// g.mutation("updateGlobalTopic", {
//   args: { input: g.inputRef(inputToUpdateGlobalTopic) },
//   returns: g.string(),
//   resolver: "updateGlobalTopic",
// })
// const link = g.input("link", {
//   title: g.string(),
//   url: g.string(),
//   author: g.string().optional(),
//   year: g.int().optional(),
//   completed: g.boolean().optional(),
//   addedByUser: g.boolean().optional(),
// })
// const publicGlobalTopic = g.type("publicGlobalTopic", {
//   prettyName: g.string(),
//   topicSummary: g.string(),
// })
// const section = g.input("section", {
//   title: g.string(),
//   links: g.inputRef(link).list(),
// })
