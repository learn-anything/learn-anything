import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"
import { hankoIdFromToken } from "../lib/hanko-validate"

// for now its just a proxy to get the title to get around cors issue
// TODO: in future, do call to db and check if we have a url like this
// if yes, fill it with details we do have or at least let users pick the details
// essentially check if it's a GlobalLink already + more
export default async function getSuggestionsForUrlResolver(
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
      let description = ""
      let summary = ""
      const rewriter_title = new HTMLRewriter().on("title", {
        text(text) {
          title += text.text
        }
      })
      const rewriter_description = new HTMLRewriter().on("meta[name='description' s]", {
        element(element) {
            description += element.getAttribute('content')
          }
      })
      await rewriter_title.transform(response.clone()).text()
      await rewriter_description.transform(response.clone()).text()
      summary += title + " // " + description
      if (title && description) {
        console.log(args.linkUrl, summary)
        return summary 
      } else {
        if (description) {
            console.error("Title not found", args.linkUrl)
            throw new GraphQLError("Title not found")    
        }
        else if (title) {
            console.error("Description not found", args.linkUrl)
            throw new GraphQLError("Description not found")
        }
      }
    }
  } catch (err) {
    console.error(err, { args })
    throw new GraphQLError(JSON.stringify(err))
  }
}
