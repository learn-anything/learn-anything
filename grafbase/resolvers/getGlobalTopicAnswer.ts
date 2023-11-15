import { Context } from "@grafbase/sdk"
import { GraphQLError } from "graphql"
import { hankoIdFromToken } from "../lib/hanko-validate"

export default async function getSuggestionsForUrlResolver(
  root: any,
  args: { topicName: string, question: string },
  context: Context
) {
  try {
    const hankoId = await hankoIdFromToken(context)
    if (hankoId) {
        const answer = await context.ai.textLlm({
            model: 'meta/llama-2-7b-chat-int8',
            messages: [
              {
                role: 'system', content: 'You are an expert on '.concat(args.topicName)
              },
              {
                role: 'user', content: args.question
              }
            ]
        })
        return answer
    }
  } catch (err) {
    console.error(err, { args })
    throw new GraphQLError(JSON.stringify(err))
  }
}
