import { createServerFn } from "@tanstack/start"
import { get } from "ronin"

export const getFeatureFlag = createServerFn({ method: "GET" })
  .validator((input: string) => input)
  .handler(async ({ data }) => {
    const response = await get.featureFlag.with({
      name: data,
    })

    return response
  })
