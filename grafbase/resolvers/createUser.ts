import { addUser } from "edgedb/crud/user"
import { validHankoToken } from "lib/grafbase/grafbase"

export default async function createUser(
  root: any,
  args: { email: string },
  context: any,
) {
  if (await validHankoToken(context)) {
    await addUser({ email: args.email })
  }
}
