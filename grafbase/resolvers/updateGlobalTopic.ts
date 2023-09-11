import { validUserEmailFromToken } from "../../lib/grafbase/hanko-validate"

export default async function updateGlobalTopic(
  root: any,
  args: { topicName: string },
  context: any,
) {
  const email = await validUserEmailFromToken(context)
  if (email) {
    console.log("run!!")
  }
}
