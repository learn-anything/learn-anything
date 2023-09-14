import { client } from "../client"
import e from "../dbschema/edgeql-js"

export async function checkForGlobalLink(url: string) {

  const link = await e.select(e.GlobalLink, () => ({
    filter_single: { url: }

  }))
}
