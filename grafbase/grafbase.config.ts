import { config, g } from "@grafbase/sdk"
export default config({
  schema: g,
  auth: {
    rules: (rules) => {
      rules.public()
    }
  }
})

// public queries
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
  args: { plan: g.string() },
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
g.mutation("updateLatestGlobalGuide", {
  args: {
    topicName: g.string(),
    topicSummary: g.string(),
    sections: g.inputRef(section).list()
  },
  returns: g.string(),
  resolver: "updateLatestGlobalGuide"
})

// g.mutation("updateTopicLearningStatus", {
//   args: { learningStatus: g.enumRef(learningStatus), topic: g.string() },
//   returns: g.string(),
//   resolver: "updateTopicLearningStatus",
// })

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

// definitions
// const learningStatus = g.enum("learningStatus", [
//   "to_learn",
//   "learning",
//   "learned",
// ])
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
