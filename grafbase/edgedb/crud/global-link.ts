import { client } from "../client"
import e from "../dbschema/edgeql-js"
import { parseURL } from "ufo"

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
      url: true,
      limit: 100,
    }))
    .run(client)
  return links
}

// was used as a one off script to strip protocol from the urls
export async function removeProtocolFromUrlOfGlobalLinks() {
  const globalLinks = await e
    .select(e.GlobalLink, () => ({
      id: true,
      url: true,
      fullUrl: true,
      protocol: true,
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
          fullUrl: globalLink.url,
        },
      }))
      .run(client)
  }
}

export async function removeEndingSlashFromUrls() {
  const globalLinks = await e
    .select(e.GlobalLink, () => ({
      id: true,
      url: true,
    }))
    .run(client)

  for (const globalLink of globalLinks) {
    if (globalLink.url.endsWith("/")) {
      const newUrl = removeTrailingSlash(globalLink.url)
      await e
        .update(e.GlobalLink, () => ({
          filter_single: { id: globalLink.id },
          set: {
            url: newUrl,
          },
        }))
        .run(client)
    }
  }
}

export async function addGlobalLink(
  url: string,
  title: string,
  year?: string,
  description?: string,
) {
  const [urlWithoutProtocol, protocol] = splitUrlByProtocol(url)
  // console.log(urlWithoutProtocol, "url without")
  // console.log(protocol, "prot")
  if (urlWithoutProtocol) {
    await e
      .insert(e.GlobalLink, {
        url: urlWithoutProtocol,
        protocol: protocol,
        title: title,
        verified: true,
        public: true,
        year: year,
        description: description,
      })
      .run(client)
  }
}

export async function removeDuplicateUrls() {
  const links = await e
    .select(e.GlobalLink, () => ({
      id: true,
      url: true,
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
    ([_, ids]) => ids.length > 1,
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

function removeTrailingSlash(str: string) {
  if (str.endsWith("/")) {
    return str.slice(0, -1)
  }
  return str
}

function splitUrlByProtocol(url: string) {
  const parsedUrl = parseURL(url)
  let host = parsedUrl.host
  if (host?.includes("www")) {
    host = host?.replace("www.", "")
  }
  let urlWithoutProtocol = host + parsedUrl.pathname + parsedUrl.search

  let protocol = parsedUrl.protocol
  if (protocol) {
    protocol = protocol.replace(":", "")
  }
  return [urlWithoutProtocol, protocol]
}
