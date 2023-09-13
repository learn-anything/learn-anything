import { GraphQLError } from "graphql"
import { validUserEmailFromToken } from "../../lib/grafbase/hanko-validate"

export default async function createUserResolver(
  root: any,
  args: { email: string },
  context: any,
) {
  const email = await validUserEmailFromToken(context)
  if (email) {
    // TODO: mocking for now, update with real db call
    return {
      url: "https://learn-anything.xyz",
      title: "Learn Anything"
    }
  }
  throw new GraphQLError("Error")
}
