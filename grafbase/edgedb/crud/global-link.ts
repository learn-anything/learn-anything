import { removeTrailingSlash, splitUrlByProtocol } from "../../lib/util"
import { client } from "../client"
import e from "../dbschema/edgeql-js"
import { foundUserByHankoId } from "./lib"

export async function updateTitleOfGlobalLink(url: string, title: string) {
  const [cleanUrl, _] = splitUrlByProtocol(url)
  console.log(cleanUrl, "url")
  // return
  await e
    .update(e.GlobalLink, () => ({
      filter_single: { url: cleanUrl! },
      set: {
        title: title
      }
    }))
    .run(client)
}

export async function getAllGlobalLinks() {
  const links = await e
    .select(e.GlobalLink, () => ({
      id: true,
      title: true,
      url: true
      // limit: 100,
    }))
    .run(client)
  return links
}

export async function getAllGlobalLinksForTopic(topicName: string) {
  const topic = await e
    .select(e.GlobalTopic, () => ({
      filter_single: { name: topicName },
      id: true
    }))
    .run(client)

  if (topic) {
    const links = await e
      .select(e.GlobalLink, (gl) => ({
        filter: e.op(gl.mainTopic.id, "=", e.cast(e.uuid, topic.id)),
        id: true,
        title: true,
        url: true,
        protocol: true,
        description: true,
        year: true
      }))
      .run(client)
    return links
  }
  throw new Error("topic not found")
}

export async function getGlobalLink(id: string) {
  const link = await e
    .select(e.GlobalLink, () => ({
      filter_single: { id: id },
      title: true,
      url: true,
      verified: true,
      public: true,
      protocol: true,
      fullUrl: true,
      description: true,
      urlTitle: true,
      year: true
    }))
    .run(client)
  return link
}

// TODO: make this return previous status of link
// this way, in GlobalGuideLink, I can easily know what to update in local store
// TODO: maybe can be part of `updateGlobalLinkProgress` but keeping it like this for now
export async function likeOrUnlikeGlobalLink(
  hankoId: string,
  personalLinkId: string,
  action: "like" | "unlike"
) {
  const foundUser = foundUserByHankoId(hankoId)
  const foundLink = e.select(e.PersonalLink, () => ({
    filter_single: { id: personalLinkId }
  }))

  switch (action) {
    case "unlike":
      return e
        .update(foundUser, () => ({
          set: {
            linksLiked: { "-=": foundLink }
          }
        }))
        .run(client)
    case "like":
      return await e
        .update(foundUser, (user) => ({
          filter: e.op(
            e.op(
              e.op(user.memberUntil, ">", e.datetime_current()),
              "??",
              e.bool(false)
            ),
            "or",
            e.op(user.linksTracked, "<", 10)
          ),
          set: {
            linksLiked: { "+=": foundLink }
          }
        }))
        .run(client)
    default:
      break
  }
}

export async function updateGlobalLinkProgress(
  hankoId: string,
  personalLinkId: string,
  action: "removeProgress" | "bookmark" | "inProgress" | "complete"
) {
  const foundUser = foundUserByHankoId(hankoId)
  const foundLink = e.select(e.PersonalLink, () => ({
    filter_single: { id: personalLinkId }
  }))

  switch (action) {
    case "removeProgress":
      return e
        .update(foundUser, () => ({
          set: {
            linksBookmarked: { "-=": foundLink },
            linksInProgress: { "-=": foundLink },
            linksCompleted: { "-=": foundLink }
          }
        }))
        .run(client)
    case "bookmark":
      return await e
        .update(foundUser, (user) => ({
          filter: e.op(
            e.op(
              e.op(user.memberUntil, ">", e.datetime_current()),
              "??",
              e.bool(false)
            ),
            "or",
            e.op(user.linksTracked, "<", 10)
          ),
          set: {
            linksBookmarked: { "+=": foundLink },
            linksInProgress: { "-=": foundLink },
            linksCompleted: { "-=": foundLink }
          }
        }))
        .run(client)
    case "inProgress":
      return e
        .update(foundUser, (user) => ({
          filter: e.op(
            e.op(
              e.op(user.memberUntil, ">", e.datetime_current()),
              "??",
              e.bool(false)
            ),
            "or",
            e.op(user.linksTracked, "<", 10)
          ),
          set: {
            linksBookmarked: { "-=": foundLink },
            linksInProgress: { "+=": foundLink },
            linksCompleted: { "-=": foundLink }
          }
        }))
        .run(client)
    case "complete":
      return e
        .update(foundUser, (user) => ({
          filter: e.op(
            e.op(
              e.op(user.memberUntil, ">", e.datetime_current()),
              "??",
              e.bool(false)
            ),
            "or",
            e.op(user.linksTracked, "<", 10)
          ),
          set: {
            linksBookmarked: { "-=": foundLink },
            linksInProgress: { "-=": foundLink },
            linksCompleted: { "+=": foundLink }
          }
        }))
        .run(client)
    default:
      break
  }
}

// one off function to update all global links to have the right url
export async function updateAllGlobalLinksToHaveRightUrl() {
  const links = await e
    .select(e.GlobalLink, (gl) => ({
      filter: e.op("not", e.op("exists", gl.protocol)),
      id: true,
      title: true,
      url: true,
      protocol: true
    }))
    .run(client)

  for (const link of links) {
    console.log(links.length, "length")
    const [newUrl, protocol] = splitUrlByProtocol(link.url)

    const existingLink = await e
      .select(e.GlobalLink, (gl) => ({
        filter: e.op(gl.url, "=", newUrl!)
      }))
      .run(client)

    if (!(existingLink.length > 0) && !link.protocol) {
      const updatedLink = await e
        .update(e.GlobalLink, () => ({
          filter_single: { id: link.id },
          set: {
            url: newUrl,
            protocol: protocol,
            fullUrl: link.url
          }
        }))
        .run(client)
      console.log(updatedLink, "link updated")
    }
  }
  return links
}

export async function removeTrailingSlashFromGlobalLinks() {
  const links = await e
    .select(e.GlobalLink, (gl) => ({
      id: true,
      url: true
    }))
    .run(client)

  for (const link of links) {
    let url = link.url
    if (!url.endsWith("/")) {
      continue
    }
    url = url.endsWith("/") ? url.slice(0, -1) : url

    const existingUrl = await e
      .select(e.GlobalLink, (gl) => ({
        filter: e.op(gl.url, "=", url),
        id: true,
        url: true
      }))
      .run(client)

    if (existingUrl[0] !== undefined) {
      console.log(link.url, "url")
      // console.log(existingUrl, "existing")
      continue
      await e
        .delete(e.GlobalLink, (gl) => ({
          // @ts-ignore
          filter_single: { id: link.id }
        }))
        .run(client)
      continue
      await e
        .update(e.GlobalLink, (gl) => ({
          filter_single: { id: link.id },
          set: {
            url: url
          }
        }))
        .unlessConflict((gl) => ({}))
        .run(client)
      continue
    }
  }
  return links
}

// was used as a one off script to strip protocol from the urls
export async function removeProtocolFromUrlOfGlobalLinks() {
  const globalLinks = await e
    .select(e.GlobalLink, () => ({
      id: true,
      url: true,
      fullUrl: true,
      protocol: true
    }))
    .run(client)

  for (const globalLink of globalLinks) {
    if (globalLink.protocol) {
      continue
    }
    let [newUrl, protocol] = splitUrlByProtocol(globalLink.url)
    await e
      .update(e.GlobalLink, () => ({
        filter_single: { id: globalLink.id },
        set: {
          url: newUrl,
          protocol: protocol,
          fullUrl: globalLink.url
        }
      }))
      .run(client)
  }
}

export async function removeEndingSlashFromUrls() {
  const globalLinks = await e
    .select(e.GlobalLink, () => ({
      id: true,
      url: true
    }))
    .run(client)

  for (const globalLink of globalLinks) {
    if (globalLink.url.endsWith("/")) {
      const newUrl = removeTrailingSlash(globalLink.url)
      await e
        .update(e.GlobalLink, () => ({
          filter_single: { id: globalLink.id },
          set: {
            url: newUrl
          }
        }))
        .run(client)
    }
  }
}

export async function attachGlobalLinkToGlobalTopic(
  url: string,
  globalTopicName: string
) {
  const globalTopic = await e
    .select(e.GlobalTopic, () => ({
      prettyName: true,
      id: true,
      filter_single: { name: globalTopicName }
    }))
    .run(client)
  console.log(globalTopic, "gt")

  const [urlWithoutProtocol, _] = splitUrlByProtocol(url)

  if (urlWithoutProtocol) {
    // await e.update(e.GlobalLink, (gl) => ({
    //   // filter_single: { url: urlWithoutProtocol },
    //   // filter_single: e.op(gl, "=", urlWithoutProtocol),
    //   set: {
    //     mainTopic: { "+=": globalTopic },
    //   },
    // }))
    // await e.update(e.GlobalTopic, )
    // await e.update(e.GlobalLink, (gl) => ({
    //   filter_single: e.op(gl.url, "=", urlWithoutProtocol),
    //   set: {
    //     mainTopic: {
    //       "+=": e.select(e.GlobalTopic, (gt) => ({
    //         filter_single: { id: e.uuid(globalTopic.id) },
    //       }),
    //     }
    //   }
    // })
    // .run(client);
  }
}

export async function addGlobalLink(
  url: string,
  title: string,
  year?: string,
  description?: string,
  mainTopic?: string
) {
  const [urlWithoutProtocol, protocol] = splitUrlByProtocol(url)
  if (urlWithoutProtocol && protocol) {
    console.log(urlWithoutProtocol, "..")
    await e
      .insert(e.GlobalLink, {
        url: urlWithoutProtocol,
        protocol: protocol,
        title: title,
        verified: true,
        public: true,
        year: year,
        description: description,
        mainTopic: e.select(e.GlobalTopic, () => ({
          filter_single: { name: mainTopic! }
        }))
      })
      .unlessConflict((gl) => ({
        on: gl.url,
        else: e.update(gl, () => ({
          set: {
            mainTopic: e.select(e.GlobalTopic, () => ({
              filter_single: { name: mainTopic! }
            }))
          }
        }))
      }))
      .run(client)
  }
}

export async function addOrUpdatePersonalLink(
  hankoId: string,
  url: string,
  title: string,
  description: string,
  mainTopic: string,
  linkState: "Bookmark" | "InProgress" | "Completed" | "None",
  liked: boolean
) {
  const foundUser = foundUserByHankoId(hankoId)

  const [urlWithoutProtocol, protocol] = splitUrlByProtocol(url)
  if (urlWithoutProtocol && protocol) {
    const globalLink = await e
      .insert(e.GlobalLink, {
        url: urlWithoutProtocol,
        protocol: protocol,
        title: title,
        verified: false,
        // TODO: consider adding a switch on `add new link` to mark link public/private
        public: true
        // TODO: add main topic later
        // mainTopic: e.select(e.GlobalTopic, () => ({
        //   filter_single: { name: mainTopic! }
        // }))
      })
      .unlessConflict((gl) => ({
        on: gl.url,
        else: gl
      }))
      .run(client)

    const personalLinkId = await e
      .insert(e.PersonalLink, {
        globalLink: e.select(e.GlobalLink, () => ({
          filter_single: { id: globalLink.id }
        })),
        title: title,
        description: description,
        mainTopic: e
          .insert(e.GlobalTopic, {
            name: mainTopic.toLowerCase().replace(/\s+/g, "-"),
            prettyName: mainTopic,
            public: true,
            verified: false
          })
          .unlessConflict((topic) => ({
            on: topic.name,
            else: e.select(e.GlobalTopic, () => ({
              filter_single: {
                name: mainTopic.toLowerCase().replace(/\s+/g, "-")
              }
            }))
          }))
      })
      .unlessConflict((pl) => ({
        on: pl.globalLink,
        else: e.update(pl, () => ({
          set: {
            title: title,
            description: description,
            mainTopic: e
              .insert(e.GlobalTopic, {
                name: mainTopic.toLowerCase().replace(/\s+/g, "-"),
                prettyName: mainTopic,
                public: true,
                verified: false
              })
              .unlessConflict((topic) => ({
                on: topic.name,
                else: e.select(e.GlobalTopic, () => ({
                  filter_single: {
                    name: mainTopic.toLowerCase().replace(/\s+/g, "-")
                  }
                }))
              }))
          }
        }))
      }))
      .run(client)

    // TODO: ideally it's done in 1 query, doing another query for now
    // const globalLinkId = await e.select(e.GlobalLink, () => ({
    //   filter_single: { url: urlWithoutProtocol }
    // }))
    const personalLink = await e.select(e.PersonalLink, () => ({
      filter_single: { id: personalLinkId.id }
    }))

    switch (linkState) {
      case "Bookmark":
        await e
          .update(foundUser, () => ({
            set: {
              linksBookmarked: { "+=": personalLink }
            }
          }))
          .run(client)
        break
      case "InProgress":
        await e
          .update(foundUser, () => ({
            set: {
              linksInProgress: { "+=": personalLink }
            }
          }))
          .run(client)
        break
      case "Completed":
        await e
          .update(foundUser, () => ({
            set: {
              linksCompleted: { "+=": personalLink }
            }
          }))
          .run(client)
        break
      default:
        break
    }

    switch (liked) {
      case true:
        await e
          .update(foundUser, () => ({
            set: {
              linksLiked: { "+=": personalLink }
            }
          }))
          .run(client)
        break
      case false:
        await e
          .update(foundUser, () => ({
            set: {
              linksLiked: { "-=": personalLink }
            }
          }))
          .run(client)
        break
      default:
        break
    }
    return personalLinkId
  }
}

// TODO: delete
// export async function addPersonalLink(
//   url: string,
//   title: string,
//   hankoId: string,
//   description: string | null
// ) {
//   const [urlWithoutProtocol, protocol] = splitUrlByProtocol(url)
//   if (urlWithoutProtocol && protocol) {
//     const link = await e
//       .insert(e.PersonalLink, {
//         url: urlWithoutProtocol,
//         protocol: protocol,
//         title: title,
//         description: description
//       })
//       .unlessConflict((gl) => ({
//         on: gl.url,
//         else: e.update(gl, () => ({
//           set: {
//             url: urlWithoutProtocol,
//             protocol: protocol,
//             title: title,
//             description: description
//           }
//         }))
//       }))
//       .run(client)

//     await e
//       .update(e.User, () => ({
//         filter_single: { hankoId },
//         set: {
//           personalLinks: {
//             "+=": e.select(e.PersonalLink, () => ({
//               filter_single: { id: link.id }
//             }))
//           }
//         }
//       }))
//       .run(client)
//   }
// }

export async function removeDuplicateUrls() {
  const links = await e
    .select(e.GlobalLink, () => ({
      id: true,
      url: true
    }))
    .run(client)

  const urlMap = new Map()

  links.forEach((link) => {
    if (urlMap.has(link.url)) {
      urlMap.get(link.url).push(link.id)
    } else {
      urlMap.set(link.url, [link.id])
    }
  })

  const duplicateUrls = Array.from(urlMap.entries()).filter(
    ([_, ids]) => ids.length > 1
  )
  console.log(duplicateUrls, "dup")

  // console.log(duplicateUrls, "dup urls")
  // duplicateUrls.forEach(async ([_, ids]) => {
  //   const res = await e
  //     .delete(e.GlobalLink, () => ({
  //       filter_single: { id: ids[0] },
  //     }))
  //     .run(client)
  //   console.log(res, "res")
  // })
}
