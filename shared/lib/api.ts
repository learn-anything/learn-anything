import Mobius from "graphql-mobius"
import { grafbaseTypeDefs } from "."

export function createMobiusFromApiToken(
  apiToken: string,
  grafbaseApiUrl: string
) {
  return new Mobius<typeof grafbaseTypeDefs>({
    fetch: (query) =>
      fetch(grafbaseApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`
        },
        body: JSON.stringify({
          query,
          variables: {}
        })
      }).then((res) => res.json())
  })
}
