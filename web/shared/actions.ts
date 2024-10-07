import { getAuth } from "@clerk/tanstack-start/server"
import { createServerFn } from "@tanstack/start"
import { create } from "ronin"
import { z } from "zod"

const MAX_FILE_SIZE = 1 * 1024 * 1024
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]

const ImageRuleSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => ALLOWED_FILE_TYPES.includes(file.type), {
      message:
        "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "File size exceeds the maximum limit of 1 MB.",
    }),
})

export const storeImageFn = createServerFn(
  "POST",
  async (data: FormData, { request }) => {
    const auth = await getAuth(request)

    if (!auth.userId) {
      throw new Error("Unauthorized")
    }

    const { file } = ImageRuleSchema.parse({ file: data.get("file") })

    const fileModel = await create.image.with({
      content: file,
      name: file.name,
      type: file.type,
      size: file.size,
    })

    return { fileModel }
  },
)
