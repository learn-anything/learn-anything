import { Context } from "@grafbase/sdk"

// TODO: not used, delete?
export default async function updateGlobalTopicResolver(
  root: any,
  args: { topic: any },
  context: Context
) {
  try {
    // const hankoId = await hankoIdFromToken(context)
    // if (hankoId) {
    //   await resetGlobalTopicSections(hankoId, args.topic)
    // }
  } catch (err) {
    // logError("updateGlobalTopic", err, { args })
    // throw new GraphQLError(JSON.stringify(err))
  }
}
