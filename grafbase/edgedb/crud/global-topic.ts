import { GlobalTopic } from "../../types/types"
import { client } from "../client"
import e from "../dbschema/edgeql-js"
import { GlobalGuideSection } from "../dbschema/edgeql-js/modules/default"
import { queryGetGlobalTopic } from "../queries/queryGetGlobalTopic.query"

export async function updateGlobalTopic(
  topicName: string,
  topic: {
    description?: string
    topicWebsiteLink?: string
    wikipediaLink?: string
    githubLink?: string
    xLink?: string
    redditLink?: string
    aiSummary?: string
  }
) {
  e.update(e.GlobalTopic, (gt) => ({
    filter: e.op(gt.name, "=", topicName),
    set: {
      ...(topic.description !== undefined && {
        description: topic.description
      }),
      ...(topic.topicWebsiteLink !== undefined && {
        topicWebsiteLink: topic.topicWebsiteLink
      }),
      ...(topic.wikipediaLink !== undefined && {
        wikipediaLink: topic.wikipediaLink
      }),
      ...(topic.githubLink !== undefined && { githubLink: topic.githubLink }),
      ...(topic.xLink !== undefined && { xLink: topic.xLink }),
      ...(topic.redditLink !== undefined && { redditLink: topic.redditLink }),
      ...(topic.aiSummary !== undefined && { aiSummary: topic.aiSummary })
    }
  })).run(client)
}

export async function checkGlobalTopicExists(topicName: string) {
  const topic = await e
    .select(e.GlobalTopic, (gt) => ({
      filter: e.op(gt.name, "=", topicName)
    }))
    .run(client)
  return topic
}

// select GlobalGuideSection
// filter .<sections[is GlobalGuide].<latestGlobalGuide[is GlobalTopic].name = "design"
export async function checkSectionsAreEmpty(topicName: string) {
  return await e
    .select(GlobalGuideSection, (section) => ({
      filter: e.op(
        section["<sections[is GlobalGuide]"][
          "<latestGlobalGuide[is GlobalTopic]"
        ].name,
        "=",
        topicName
      )
    }))
    .run(client)
}

export async function changeGlobalTopicVerifiedstatus(
  topicName: string,
  verified: boolean
) {
  return await e
    .update(e.GlobalTopic, (gt) => ({
      filter: e.op(gt.name, "=", topicName),
      set: {
        verified: verified
      }
    }))
    .run(client)
}

export async function getAllTopicNames() {
  const topics = e
    .select(e.GlobalTopic, () => ({
      name: true,
      prettyName: true
    }))
    .run(client)
  return topics
}

export async function resetGlobalTopicSections(
  globalTopic: Omit<GlobalTopic, "prettyName">
) {
  // TODO: this function is secured by resolver itself, this code is useful for reference
  // as its destructive and wipes the whole global guide
  // const adminUser = await e
  //   .select(e.User, (user) => ({
  //     filter: e.all(
  //       e.set(e.op(user.hankoId, "=", hankoId), e.op(user.admin, "=", true))
  //     )
  //   }))
  //   .run(client)
  // if (adminUser.length === 0) {
  //   return
  // }

  await e
    .delete(e.GlobalGuideSection, (section) => ({
      filter: e.op(
        section["<sections[is GlobalGuide]"][
          "<latestGlobalGuide[is GlobalTopic]"
        ].name,
        "=",
        globalTopic.name
      )
    }))
    .run(client)

  console.log(globalTopic.topicSummary, "summary")
  await e
    .update(e.GlobalTopic, () => ({
      filter_single: { name: globalTopic.name },
      set: {
        topicSummary: globalTopic.topicSummary
      }
    }))
    .run(client)

  globalTopic.sections.map(async (section) => {
    await e
      .params({ linkIds: e.array(e.uuid) }, (params) => {
        const linkWithIndex = e.enumerate(e.array_unpack(params.linkIds))
        return e.update(e.GlobalGuide, (guide) => ({
          filter: e.op(
            guide["<latestGlobalGuide[is GlobalTopic]"].name,
            "=",
            globalTopic.name
          ),
          set: {
            sections: {
              "+=": e.insert(e.GlobalGuideSection, {
                title: section.title,
                summary: section.summary,
                links: e.for(linkWithIndex, (li) =>
                  e.select(e.GlobalLink, (l) => ({
                    filter: e.op(l.id, "=", li[1]),
                    "@order": e.cast(e.int16, li[0])
                  }))
                )
              })
            }
          }
        }))
      })
      .run(client, { linkIds: section.linkIds })
  })
}

export async function deleteSectionsInGlobalTopic(globalTopicName: string) {
  await e
    .delete(e.GlobalGuideSection, (section) => ({
      filter: e.op(
        section["<sections[is GlobalGuide]"][
          "<latestGlobalGuide[is GlobalTopic]"
        ].name,
        "=",
        globalTopicName
      )
    }))
    .run(client)
}

export async function addLinkToSectionOfGlobalTopic(
  globalTopicName: string,
  sectionName: string,
  linkUrl: string
) {
  // check section exists in topic guide
  const section = await e
    .select(e.GlobalGuideSection, (section) => ({
      filter: e.all(
        e.set(
          e.op(
            section["<sections[is GlobalGuide]"][
              "<latestGlobalGuide[is GlobalTopic]"
            ].name,
            "=",
            globalTopicName
          ),
          e.op(section.title, "=", sectionName)
        )
      )
    }))
    .run(client)

  if (section.length === 0) {
    const sectionToAdd = await e
      .insert(e.GlobalGuideSection, {
        title: sectionName,
        links: e.select(e.GlobalLink, (gl) => ({
          filter: e.op(gl.url, "=", linkUrl)
        }))
      })
      .run(client)

    await e
      .update(e.GlobalGuide, (guide) => ({
        filter: e.op(
          guide["<latestGlobalGuide[is GlobalTopic]"].name,
          "=",
          globalTopicName
        ),
        set: {
          sections: {
            "+=": e.select(e.GlobalGuideSection, (s) => ({
              filter: e.op(s.id, "=", e.uuid(sectionToAdd.id))
            }))
          }
        }
      }))
      .run(client)
    return
  }

  await e
    .update(e.GlobalGuideSection, (section) => ({
      filter: e.all(
        e.set(
          e.op(
            section["<sections[is GlobalGuide]"][
              "<latestGlobalGuide[is GlobalTopic]"
            ].name,
            "=",
            globalTopicName
          ),
          e.op(section.title, "=", sectionName)
        )
      ),
      set: {
        links: {
          "+=": e.select(e.GlobalLink, (gl) => ({
            filter: e.op(gl.url, "=", linkUrl)
          }))
        }
      }
    }))
    .run(client)
}

export async function moveAllLinksOfGlobalTopicToSectionOther(
  globalTopicName: string
) {
  await e
    .update(e.GlobalGuide, (guide) => ({
      filter: e.op(
        guide["<latestGlobalGuide[is GlobalTopic]"].name,
        "=",
        globalTopicName
      ),
      set: {
        sections: {
          "+=": e.insert(e.GlobalGuideSection, {
            title: "Other",
            links: e.select(e.GlobalLink, (gl) => ({
              filter: e.op(gl.mainTopic.name, "=", globalTopicName)
            }))
          })
        }
      }
    }))
    .run(client)
}

export async function createIntroSectionInGlobalTopic(globalTopicName: string) {
  await e
    .update(e.GlobalGuide, (guide) => ({
      filter: e.op(
        guide["<latestGlobalGuide[is GlobalTopic]"].name,
        "=",
        globalTopicName
      ),
      set: {
        sections: {
          "+=": e.insert(e.GlobalGuideSection, {
            title: "Intro"
          })
        }
      }
    }))
    .run(client)
}

export async function updatePrettyNameOfGlobalTopic(
  globalTopicName: string,
  prettyName: string
) {
  await e
    .update(e.GlobalTopic, (gt) => ({
      filter_single: { name: globalTopicName },
      set: {
        prettyName: prettyName
      }
    }))
    .run(client)
}

// export async function getLearningStatus(hankoId: string, topicName: string) {
//   const userByHankoId = e.select(e.User, (user) => ({
//     filter: e.all(
//       e.set(
//         e.op(user.hankoId, "=", hankoId),
//         e.op("exists", user.memberUntil),
//         e.op(user.memberUntil, ">", e.datetime_current())
//       )
//     )
//   }))
//   const topicByName = e.select(e.GlobalTopic, () => ({
//     filter_single: { name: topicName }
//   }))
// }

export async function updateTopicLearningStatus(
  hankoId: string,
  topicName: string,
  learningStatus: "to_learn" | "learning" | "learned" | "none"
) {
  const userByHankoId = e.select(e.User, (user) => ({
    filter: e.all(
      e.set(
        e.op(user.hankoId, "=", hankoId),
        e.op("exists", user.memberUntil),
        e.op(user.memberUntil, ">", e.datetime_current())
      )
    )
  }))
  const topicByName = e.select(e.GlobalTopic, () => ({
    filter_single: { name: topicName }
  }))

  switch (learningStatus) {
    case "none":
      return e
        .update(userByHankoId, () => ({
          set: {
            topicsToLearn: { "-=": topicByName },
            topicsLearning: { "-=": topicByName },
            topicsLearned: { "-=": topicByName }
          }
        }))
        .run(client)
    case "to_learn":
      return e
        .update(userByHankoId, () => ({
          set: {
            topicsToLearn: { "+=": topicByName },
            topicsLearning: { "-=": topicByName },
            topicsLearned: { "-=": topicByName }
          }
        }))
        .run(client)

    case "learning":
      return e
        .update(userByHankoId, () => ({
          set: {
            topicsToLearn: { "-=": topicByName },
            topicsLearning: { "+=": topicByName },
            topicsLearned: { "-=": topicByName }
          }
        }))
        .run(client)
    case "learned":
      return e
        .update(userByHankoId, () => ({
          set: {
            topicsToLearn: { "-=": topicByName },
            topicsLearning: { "-=": topicByName },
            topicsLearned: { "+=": topicByName }
          }
        }))
        .run(client)
    default:
      break
  }
}

export async function updateUnverifiedTopicLearningStatus(
  hankoId: string,
  topicName: string,
  learningStatus: "to_learn" | "learning" | "learned" | "none"
) {
  const userByHankoId = e.select(e.User, (user) => ({
    filter: e.all(
      e.set(
        e.op(user.hankoId, "=", hankoId),
        e.op("exists", user.memberUntil),
        e.op(user.memberUntil, ">", e.datetime_current())
      )
    )
  }))
  let topic = await e
    .select(e.GlobalTopic, () => ({
      filter_single: { name: topicName }
    }))
    .run(client)

  console.log(topic, "topic found")
  if (!topic) {
    topic = await e
      .insert(e.GlobalTopic, {
        name: topicName,
        prettyName: topicName,
        topicSummary: "",
        public: true,
        verified: false
      })
      .run(client)
  }

  const topicToChangeStatusOf = await e.select(e.GlobalTopic, () => ({
    filter_single: { name: topicName }
  }))
  switch (learningStatus) {
    case "none":
      return e
        .update(userByHankoId, () => ({
          set: {
            topicsToLearn: { "-=": topicToChangeStatusOf },
            topicsLearning: { "-=": topicToChangeStatusOf },
            topicsLearned: { "-=": topicToChangeStatusOf }
          }
        }))
        .run(client)
    case "to_learn":
      return e
        .update(userByHankoId, () => ({
          set: {
            topicsToLearn: { "+=": topicToChangeStatusOf },
            topicsLearning: { "-=": topicToChangeStatusOf },
            topicsLearned: { "-=": topicToChangeStatusOf }
          }
        }))
        .run(client)

    case "learning":
      return e
        .update(userByHankoId, () => ({
          set: {
            topicsToLearn: { "-=": topicToChangeStatusOf },
            topicsLearning: { "+=": topicToChangeStatusOf },
            topicsLearned: { "-=": topicToChangeStatusOf }
          }
        }))
        .run(client)
    case "learned":
      return e
        .update(userByHankoId, () => ({
          set: {
            topicsToLearn: { "-=": topicToChangeStatusOf },
            topicsLearning: { "-=": topicToChangeStatusOf },
            topicsLearned: { "+=": topicToChangeStatusOf }
          }
        }))
        .run(client)
    default:
      break
  }
}

// for use in landing page (learn-anything.xyz) to get results of topics to search over
// its public because in future for auth'd users, we can show more custom results
// based of user preference etc.
export async function publicGetGlobalTopics() {
  const globalTopics = await e
    .select(e.GlobalTopic, () => ({
      prettyName: true,
      name: true
    }))
    .run(client)
  return globalTopics
}

// get all info needed to render global topic page (for non auth users) (i.e. learn-anything.xyz/physics)
export async function getGlobalTopicPublic(topicName: string) {
  return await e
    .select(e.GlobalTopic, (t) => ({
      filter_single: { name: topicName },
      prettyName: true,
      topicSummary: true,
      // topicPath: true,
      // description: true,
      // topicWebsiteLink: true,
      // wikipediaLink: true,
      // githubLink: true,
      // xLink: true,
      // aiSummary: true,
      // redditLink: true,
      latestGlobalGuide: {
        sections: {
          title: true,
          summary: true,
          links: {
            id: true,
            title: true,
            url: true,
            year: true,
            protocol: true,
            description: true
          }
        }
      },
      links: e.select(e.GlobalLink, (gl) => ({
        filter: e.op(gl.mainTopic.id, "=", e.cast(e.uuid, t.id)),
        id: true,
        title: true,
        url: true,
        year: true,
        protocol: true
      })),
      notesCount: e.count(
        e.select(e.GlobalNote, (gn) => ({
          filter: e.op(gn.mainTopic.id, "=", e.cast(e.uuid, t.id))
        }))
      )
    }))
    .run(client)
}

// export async function deleteSectionsInGlobalTopic(topicName: string) {
//   const res = await queryDeleteSectionsInGlobalTopic(client, {
//     topicName
//   })
//   return res
// }

// get details for global topic for auth users
export async function getGlobalTopicDetails(
  topicName: string,
  hankoId: string
) {
  const res = await queryGetGlobalTopic(client, {
    topicName: topicName,
    hankoId: hankoId
  })
  return res
  // TODO: below is attempt to do it with edgedb-js
  // const userData = await e
  //   .select(e.User, (user) => ({
  //     // learningState: e.op(e.str("learned"), "if", e.op(e.str(topicName), "in", user.topicsLearned.name)),
  //     // learningState: e.op(e.str("learned"), "if", e.op(e.str(topicName), "in", user.topicsLearned.name), "else", e.str("other"),
  //     // topicsLearned: e.op(e.str("learned"), "if", e.op(e.str(topicName), "in", user.topicsLearned.name)), "else"
  //     // topicsLearning:
  //     // topicsLearned: e.select(user.topicsLearned, (gt) => ({
  //     //   filter: e.op(gt.name, "=", topicName)
  //     // })),
  //     // topicsLearning: e.select(user.topicsLearning, (gt) => ({
  //     //   filter: e.op(gt.name, "=", topicName)
  //     // })),
  //     // topicsToLearn: e.select(user.topicsLearning, (gt) => ({
  //     //   filter: e.op(gt.name, "=", topicName)
  //     // })),
  //     // likedLinks: true,
  //     // completedLinks: true,
  //     filter: e.all(
  //       e.set(
  //         e.op(user.hankoId, "=", hankoId),
  //         e.op("exists", user.memberUntil),
  //         e.op(user.memberUntil, ">", e.datetime_current())
  //       )
  //     )
  //   }))
  //   .run(client)
  // return userData
}

export async function addSectionToGlobalTopic(
  topicName: string,
  sectionName: string,
  order: number
) {
  const topic = await e
    .select(e.GlobalTopic, () => ({
      filter_single: { name: topicName },
      id: true,
      latestGlobalGuide: true
    }))
    .run(client)

  const newSection = await e
    .insert(e.GlobalGuideSection, {
      title: sectionName,
      order: order
    })
    .run(client)

  if (topic) {
    return await e
      .update(e.GlobalGuide, () => {
        return {
          filter_single: { id: topic.latestGlobalGuide.id },
          set: {
            sections: {
              "+=": e.select(e.GlobalGuideSection, () => ({
                filter_single: { id: newSection.id }
              }))
            }
          }
        }
      })
      .run(client)
  }
}

export async function addNewSectionToGlobalGuide(
  topicName: string,
  sectionTitle: string,
  order: number
) {
  const query = e.insert(e.GlobalGuideSection, {
    title: sectionTitle,
    order: order
  })
}

export async function setPrettyNameOfGlobalTopic(
  topicName: string,
  prettyName: string
) {
  await e
    .update(e.GlobalTopic, (gt) => ({
      filter: e.op(gt.name, "=", topicName),
      set: {
        prettyName: prettyName
      }
    }))
    .run(client)
}

export async function createGlobalTopicWithGlobalGuide(
  topicName: string,
  prettyName: string,
  topicSummary: string
) {
  const query = e.insert(e.GlobalTopic, {
    name: topicName,
    prettyName: prettyName,
    topicSummary: topicSummary,
    public: true,
    latestGlobalGuide: e.insert(e.GlobalGuide, {})
  })
  return query.run(client)
}

// export async function editGlobalGuide(globalTopic: string) {
//   const query = e.update(e.GlobalGuide, {

//   })
// }

// export async function getGlobalTopic(topicName: string, email: string) {
//   const query = e.params(
//     {
//       topicName: e.str,
//       email: e.str,
//     },
//     (params) => {
//       e.select(e.GlobalTopic, (gt) => {
//         const userQuery = e.select(e.User, (user) => {
//           topicsToLearn: e.op("exists", user.topicsToLearn)
//         })
//         return {
//           id: true,
//           name: true,
//           prettyName: true,
//           topicSummary: true,
//           filter_single: { name: topicName },
//           // learningStatus:
//         }
//       })
//     },
//   )

//   return query.run(client, {
//     topicName,
//     email
//   })
// }

// Add a global topic
// export async function addGlobalTopic(topic: GlobalTopic) {
//   const query = e.params(
//     {
//       name: e.str,
//       prettyName: e.str,
//       topicSummary: e.str,
//       public: e.bool,
//     },
//     (params) => {
//       // const newGlobalTopic = e.insert(e.GlobalTopic, {
//       //   name: params.name,
//       //   prettyName: params.prettyName,
//       //   topicSummary: params.topicSummary,
//       //   public: params.public,
//       // })
//       // return e.with([newGlobalTopic],
//       //   e.insert(e.GlobalGuide ,{
//       //     globalTopic: newGlobalTopic,
//       //     sections
//       //   })
//       //   )
//     },
//   )
//   return query.run(client, {
//     name: topic.name,
//     prettyName: topic.prettyName,
//     topicSummary: topic.topicSummary,
//     public: true,
//   })
// }

// export async function getGlobalTopic(topicName: string) {
//   const query = e.params(
//     {
//       name: e.str,
//       prettyName: e.str,
//       topicSummary: e.str,
//       public: e.bool,
//     },
//     (params) => {
//       // const newGlobalTopic = e.insert(e.GlobalTopic, {
//       //   name: params.name,
//       //   prettyName: params.prettyName,
//       //   topicSummary: params.topicSummary,
//       //   public: params.public,
//       // })
//       // return e.with([newGlobalTopic],
//       //   e.insert(e.GlobalGuide ,{
//       //     globalTopic: newGlobalTopic,
//       //     sections
//       //   })
//       //   )
//     },
//   )
//   return query.run(client, {
//     // name: topic.name,
//     // prettyName: topic.prettyName,
//     // topicSummary: topic.topicSummary,
//     // public: true,
//   })
// }

// export async function getAllGlobalTopics(topicName: string) {
//   const query = e.select(e.Topic, (topic) => ({
//     filter: e.op(topic.name, "=", topicName),
//   }))
//   const res = await query.run(client)
//   if (res.length === 0) {
//     return false
//   }
//   return true
// }

// type GlobalTopic = {
//   name: string
//   prettyName: string
//   topicSummary: string
//   public: true
// }

// export async function getGlobalTopics(topicName: string) {
//   const query = e.select(e.GlobalTopic, (globalTopic) => ({
//     name: true,
//     prettyName: true,
//     topicSummary: true,
//     filter_single: { name: topicName },
//   }))

//   const result = await query.run(client)
//   return result
// }
