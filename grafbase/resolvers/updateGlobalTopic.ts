import { hankoIdFromToken } from "../lib/hanko-validate"

export default async function updateGlobalTopic(
  root: any,
  args: { topicName: string },
  context: any,
) {
  const hankoId = await hankoIdFromToken(context)
  if (hankoId) {
    console.log("run!!")
  }
}
