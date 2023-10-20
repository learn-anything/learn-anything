import { config, g } from "@grafbase/sdk"
export default config({
  schema: g,
  experimental: {
    kv: true
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

const GlobalLink = g.type("GlobalLink", {
  id: g.string(),
  title: g.string(),
  url: g.string(),
  protocol: g.string(),
  year: g.string().optional(),
  description: g.string().optional()
})
const globalGuideSection = g.type("globalGuideSection", {
  title: g.string(),
  summary: g.string().optional(),
  links: g.ref(GlobalLink).list()
})
const latestGlobalGuide = g.type("latestGlobalGuide", {
  summary: g.string(),
  sections: g.ref(globalGuideSection).list()
})
g.query("publicGetGlobalTopic", {
  args: { topicName: g.string() },
  returns: g.ref(
    g.type("publicGetGlobalTopicOutput", {
      name: g.string(),
      prettyName: g.string(),
      topicSummary: g.string(),
      topicPath: g.string().optional(),
      latestGlobalGuide: g.ref(latestGlobalGuide).optional(),
      links: g.ref(GlobalLink).list()
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

g.query("getLikedLinks", {
  args: {},
  returns: g.ref(
    g.type("outputOfGetLikedLinks", {
      likedLinks: g
        .ref(
          g.type("LikedLink", {
            id: g.string(),
            title: g.string(),
            url: g.string()
          })
        )
        .list(),
      personalLinks: g
        .ref(
          g.type("PersonalLink", {
            id: g.string(),
            title: g.string(),
            url: g.string()
          })
        )
        .list()
    })
  ),
  resolver: "getLikedLinks"
})

const topicToLearn = g.type("topicToLearn", {
  name: g.string(),
  prettyName: g.string()
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
      protocol: g.string().optional(),
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
      learningStatus: g.enumRef(learningStatus),
      likedLinkIds: g.string().list(),
      completedLinkIds: g.string().list()
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

g.query("checkForGlobalLink", {
  args: { linkUrl: g.string() },
  returns: g.ref(
    g.type("publicCheckForGlobalLinkOutput", {
      url: g.string(),
      title: g.string(),
      year: g.int().optional(),
      description: g.string().optional()
    })
  ),
  resolver: "checkForGlobalLink"
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

const linkAction = g.enum("linkAction", [
  "like",
  "unlike",
  "complete",
  "uncomplete"
])
g.mutation("updateLinkStatusResolver", {
  args: { linkId: g.string(), action: g.enumRef(linkAction) },
  returns: g.string(),
  resolver: "updateLinkStatus"
})

const globalLinkAction = g.enum("globalLinkAction", [
  "like",
  "unlike",
  "complete",
  "uncomplete"
])
g.mutation("updateGlobalLinkStatus", {
  args: { action: g.enumRef(globalLinkAction), globalLinkId: g.string() },
  returns: g.string(),
  resolver: "updateGlobalLinkStatus"
})

g.mutation("addPersonalLink", {
  args: {
    title: g.string(),
    url: g.string(),
    description: g.string().optional()
  },
  returns: g.string(),
  resolver: "addPersonalLink"
})

// internal
g.mutation("internalUpdateMemberUntilOfUser", {
  args: {
    email: g.string(),
    memberUntilDateInUnixTime: g.int()
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
