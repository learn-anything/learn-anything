// import * as edgedb from "edgedb"
// import { getTopic } from "grafbase/db/topic"

// TODO: grafbase hopefully soon will support typing resolvers
// returns a topic for a given user
export default async function getTopicResolver(
  root: any,
  args: { topicName: string; userId: string },
  context: any,
) {
  console.log(args.topicName)
  console.log(args.userId)

  // const topic = await getTopic(args.topicName, args.userId)
  // return topic
  return args.topicName
}
