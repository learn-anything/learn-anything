import { client } from "../client"
import e from "../dbschema/edgeql-js"
import { parseURL } from 'ufo'
// import { writeContentToSrcData } from "@nikitavoloboev/ts/files"

// export async function checkForGlobalLink(url: string) {
//   // const link = await e.select(e.GlobalLink, () => ({
//   //   filter_single: { url: }
//   // }))
// }

export async function getAllGlobalLinks() {
  const links = await e.select(e.GlobalLink, () => ({
    title: true,
    url: true
  })).run(client)
  return links
}

export async function removeProtocolFromUrlOfGlobalLinks() {
  console.log("run")
  // const res = e.update(e.GlobalLink, (gl) => ({
  //   set: {
  //     url:
  //   }
  // }))
}

function getURLWithoutProtocol(url: string) {
  let parsedUrl = parseURL(url)
  let urlWithoutProtocol = parsedUrl.host
  if (urlWithoutProtocol?.includes("www")) {
    urlWithoutProtocol = parsedUrl.host?.replace("www.", "")
  }
  return urlWithoutProtocol
}
