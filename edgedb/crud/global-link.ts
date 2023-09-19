import { client } from "../client"
import e from "../dbschema/edgeql-js"
import { parseURL } from "ufo"
// import { writeContentToSrcData } from "@nikitavoloboev/ts/files"

// export async function checkForGlobalLink(url: string) {
//   // const link = await e.select(e.GlobalLink, () => ({
//   //   filter_single: { url: }
//   // }))
// }

export async function getAllGlobalLinks() {
  const links = await e
    .select(e.GlobalLink, () => ({
      title: true,
      url: true,
    }))
    .run(client)
  return links
}

export async function removeProtocolFromUrlOfGlobalLinks() {
  console.log("running")
  const globalLinks = await e
    .select(e.GlobalLink, () => ({
      id: true,
      url: true,
    }))
    .run(client)

  for (const globalLink of globalLinks) {
    console.log(globalLink.url, "url")
    console.log(globalLink.id, "id")
    let [newUrl, protocol] = splitUrlByProtocol(globalLink.url)
    console.log(newUrl, "new url")
    console.log(protocol, "protocol")
    await e
      .update(e.GlobalLink, () => ({
        filter_single: { id: globalLink.id },
        set: {
          url: newUrl,
          protocol: protocol,
        },
      }))
      .run(client)
  }
}

function splitUrlByProtocol(url: string) {
  let parsedUrl = parseURL(url)
  let urlWithoutProtocol = parsedUrl.host + parsedUrl.pathname
  let protocol = parsedUrl.protocol
  if (urlWithoutProtocol?.includes("www")) {
    // @ts-ignore
    urlWithoutProtocol = parsedUrl.host?.replace("www.", "")
  }
  // @ts-ignore
  protocol = protocol.replace(":", "")
  return [urlWithoutProtocol, protocol]
}
