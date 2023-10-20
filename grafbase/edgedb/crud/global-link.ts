import { removeTrailingSlash, splitUrlByProtocol } from "../../lib/util"
import { client } from "../client"
import e from "../dbschema/edgeql-js"

// export async function checkForGlobalLink(url: string) {
//   // const link = await e.select(e.GlobalLink, () => ({
//   //   filter_single: { url: }
//   // }))
// }

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
      fullUrl: true,
      protocol: true,
      verified: true,
      public: true,
      description: true,
      urlTitle: true,
      year: true
    }))
    .run(client)
  return link
}

export async function updateGlobalLinkStatus(
  hankoId: string,
  globalLinkId: string,
  action: "like" | "unlike" | "complete" | "uncomplete"
) {
  const userByHankoId = await e.select(e.User, (user) => ({
    filter: e.all(
      e.set(
        e.op(user.hankoId, "=", hankoId),
        e.op("exists", user.memberUntil),
        e.op(user.memberUntil, ">", e.datetime_current())
      )
    )
  }))

  const foundLink = e.select(e.GlobalLink, () => ({
    filter_single: { id: globalLinkId }
  }))

  switch (action) {
    case "like":
      return e
        .update(userByHankoId, () => ({
          set: {
            likedLinks: { "+=": foundLink }
          }
        }))
        .run(client)
    case "unlike":
      return e
        .update(userByHankoId, () => ({
          set: {
            likedLinks: { "-=": foundLink }
          }
        }))
        .run(client)
    case "complete":
      return e
        .update(userByHankoId, () => ({
          set: {
            completedLinks: { "+=": foundLink }
          }
        }))
        .run(client)
    case "uncomplete":
      return e
        .update(userByHankoId, () => ({
          set: {
            completedLinks: { "-=": foundLink }
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
    url = url.endsWith("/") ? url.slice(0, -1) : url

    const existingUrl = await e
      .select(e.GlobalLink, (gl) => ({
        filter: e.op(gl.url, "=", url)
      }))
      .run(client)

    if (existingUrl) {
      // console.log(link.url, "old url")
      // console.log(url, "new url")
      // console.log(existingUrl, "existing url")
      continue
    }

    await e
      .update(e.GlobalLink, (gl) => ({
        filter_single: { id: link.id },
        set: {
          url: url
        }
      }))
      .run(client)
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

export async function addPersonalLink(
  url: string,
  title: string,
  hankoId: string,
  description?: string
) {
  const [urlWithoutProtocol, protocol] = splitUrlByProtocol(url)
  if (urlWithoutProtocol && protocol) {
    const link = await e
      .insert(e.PersonalLink, {
        url: urlWithoutProtocol,
        protocol: protocol,
        title: title,
        description: description
      })
      .unlessConflict((gl) => ({
        on: gl.url,
        else: e.update(gl, () => ({
          set: {
            url: urlWithoutProtocol,
            protocol: protocol,
            title: title,
            description: description
          }
        }))
      }))
      .run(client)

    await e
      .update(e.User, () => ({
        filter_single: { hankoId },
        set: {
          personalLinks: {
            "+=": e.select(e.PersonalLink, () => ({
              filter_single: { id: link.id }
            }))
          }
        }
      }))
      .run(client)
  }
}

export async function addGlobalNote(
  content: string,
  url: string,
  mainTopic: string
) {
  // TODO:
}

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
