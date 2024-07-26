"use server"

import { z } from "zod"
import { createServerAction } from "zsa"

export const askGpt4ioAction = createServerAction()
  .input(
    z.object({
      question: z.string()
    })
  )
  .handler(async ({ input }) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return "some text"
  })
