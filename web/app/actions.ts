import { createServerFn } from "@tanstack/start"
import { get } from "ronin"

export const getFeatureFlag = createServerFn(
  "GET",
  async (data: { name: string }) => {
    const response = await get.featureFlag.with({
      name: data.name,
    })

    return response
  },
)
