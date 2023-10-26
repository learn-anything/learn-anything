import { GraphQLError } from "graphql"
import { hankoIdFromToken } from "../lib/hanko-validate"
import { Context } from "@grafbase/sdk"
import { logError } from "../lib/baselime"

// for now its just a proxy to get the title to get around cors issue
// TODO: in future, do call to db and check if we have a url like this
// if yes, fill it with details we do have or at least let users pick the details
// essentially check if it's a GlobalLink already + more
export default async function checkUrlResolver(
  root: any,
  args: { linkUrl: string },
  context: Context
) {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
      const url = new URL(args.linkUrl)
      const init = {
        headers: {
          "content-type": "text/html;charset=UTF-8"
        }
      }
      const response = await fetch(url, init)
      let title = ""
      const rewriter = new HTMLRewriter().on("title", {
        text(text) {
          title += text.text
        }
      })
      await rewriter.transform(response.clone()).text()
      if (title) {
        return title
      } else {
        throw new GraphQLError("Title not found")
      }
    }
  } catch (err) {
    logError("checkUrl", err, { args })
    throw new GraphQLError(JSON.stringify(err))
  }
}
