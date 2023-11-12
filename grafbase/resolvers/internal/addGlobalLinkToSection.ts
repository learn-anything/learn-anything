import { GraphQLError } from "graphql"
import { addLinkToSectionOfGlobalTopic } from "../../edgedb/crud/global-topic"
import { Context } from "@grafbase/sdk"
import { Resolver } from "@grafbase/generated"

export default async function addGlobalLinkToSection(
  root: any,
  args: { linkUrl: string; topicName: string; sectionName: string },
  context: Context
) {
  try {
    const authHeader = context.request.headers["authorization"]
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new GraphQLError("Missing or invalid Authorization header")
    }
    const token = authHeader.split("Bearer ")[1]
    if (token === process.env.INTERNAL_SECRET) {
      await addLinkToSectionOfGlobalTopic(
        args.topicName,
        args.sectionName,
        args.linkUrl
      )
      return "ok"
    }
  } catch (err) {
    console.error(err, { args })
    throw new GraphQLError(JSON.stringify(err))
  }
}

// const addGlobalLinkToSectionResolver: Resolver["Mutation.internalAddGlobalLinkToSection"] =
//   async (parent, args, { kv }, info) => {
//     try {
//       const authHeader = context.request.headers["authorization"]
//       if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         throw new GraphQLError("Missing or invalid Authorization header")
//       }
//       const token = authHeader.split("Bearer ")[1]
//       if (token === process.env.INTERNAL_SECRET) {
//         await addLinkToSectionOfGlobalTopic(
//           args.topicName,
//           args.sectionName,
//           args.linkUrl
//         )
//         return "ok"
//       }
//     } catch (err) {
//       console.error(err, { args })
//       throw new GraphQLError(JSON.stringify(err))
//     }
//   }
