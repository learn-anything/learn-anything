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

    const chunks: string[] = [input.question, "hello", "foo", "bar"]
    let i = 0

    let stream = new ReadableStream<string>({
      async pull(controller) {

        await new Promise(res => setTimeout(res, 1000))

        let chunk = chunks[i]
        i += 1

        let done = i == chunks.length

        if (done) {
          controller.close()
        } else {
          controller.enqueue(chunk)
        }
      },
    })

    // let res = new Response(stream)

    return stream
  })
