import { validHankoToken } from "../../lib/grafbase/grafbase"

export default async function updateGlobalTopic(
  root: any,
  args: { topicName: string },
  context: any,
) {
  if (await validHankoToken(context)) {
    return "success"
  }
}
