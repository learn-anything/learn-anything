import { addUser } from "edgedb/crud/user"
import { validHankoToken } from "lib/grafbase/grafbase"

export default async function createUser(
  root: any,
  args: { email: string; name?: string; prettyName?: string },
  context: any,
) {
  if (await validHankoToken(context)) {
    if (!args.name) {
      // if name is not provided, generate random username
      await addUser({ email: args.email, name: args.name })
    } else {
      await addUser({ email: args.email, name: args.name })
    }
  }
}
