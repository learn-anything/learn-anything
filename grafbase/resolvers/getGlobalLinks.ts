import { hankoIdFromToken } from "../lib/hanko-validate"
import { getAllGlobalLinks } from "../edgedb/crud/global-link"

export default async function getGLobalLinksResolver(
  root: any,
  args: any,
  context: any,
) {
  const hankoId = await hankoIdFromToken(context)
  if (hankoId) {
    const links = await getAllGlobalLinks()
    console.log(links, "links")
    return links
  }
  //   const userId = await addUser({ email: args.email, hankoId: hankoId })
  //   if (userId) {
  //     return userId
  //   }
  //   throw new GraphQLError("User already exists")
  // }
}
