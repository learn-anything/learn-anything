import { client } from "../client"
import e from "../dbschema/edgeql-js"

export async function deletePersonalLink(linkId: string) {
  await e
    .delete(e.PersonalLink, () => ({
      filter_single: { id: linkId }
    }))
    .run(client)
}
