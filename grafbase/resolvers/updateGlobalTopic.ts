import { hankoIdFromToken } from "../../lib/grafbase/hanko-validate"

export default async function updateGlobalTopic(
  root: any,
  args: { topicName: string },
  context: any,
) {
  const email = await hankoIdFromToken(context)
  if (email) {
    console.log("run!!")
  }
}
