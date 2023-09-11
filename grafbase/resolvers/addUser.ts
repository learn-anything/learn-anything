import { addUser } from "../../edgedb/crud/user"
import { validUserEmailFromToken } from "../../lib/grafbase/grafbase"

export default async function addUserResolver(
  root: any,
  args: { email: string },
  context: any,
) {
  const email = await validUserEmailFromToken(context)
  if (email) {
    await addUser({ email: args.email })
    return {
      success: true,
    }
  }
}
