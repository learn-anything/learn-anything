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

type SuccessResponse<T> = [data: T, error: undefined]
type ErrorResponse = [data: undefined, error: string]
type Response<T> = { [K in keyof T]: T[K] } & { errors?: { message: string }[] }
export function parseResponse<T>(
  res: Response<T> | null | undefined
): SuccessResponse<T> | ErrorResponse {
  if (res === null || res === undefined) {
    return [undefined, "Response is null or undefined"]
  }

  const dataKey = Object.keys(res).find((key) => key !== "errors")
  if (res.errors) {
    // @ts-ignore
    return [undefined, res.errors[0].message]
  }
  // @ts-ignore
  return [res[dataKey], undefined]
}
