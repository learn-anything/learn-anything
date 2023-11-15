import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"
import { hankoIdFromToken } from "../lib/hanko-validate"
import {QdrantClient} from '@qdrant/js-client-rest';

const client = new QdrantClient({
    url: process.env.QDRANT_URL!,
    apiKey: process.env.QDRANT_SECRET_KEY!,
});


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
        const embedding = await context.ai.textEmbeddings({
            model: 'baai/bge-large-en-v1.5',
            text: summary
        })
        const res = await client.search("topics_collections", {
            vector: embedding.data,
            limit: 3,
        })
        return res
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
