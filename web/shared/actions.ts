import { getAuth } from "@clerk/tanstack-start/server"
import { createServerFn } from "@tanstack/start"
import { create, drop } from "ronin"
import { z } from "zod"
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "./constants"

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
      width: data.get("width") ? Number(data.get("width")) : undefined,
      height: data.get("height") ? Number(data.get("height")) : undefined,
    })

    return { fileModel }
  },
)

export const deleteImageFn = createServerFn(
  "POST",
  async (data: { id: string }, { request }) => {
    const auth = await getAuth(request)

    if (!auth.userId) {
      throw new Error("Unauthorized")
    }

    await drop.image.with.id(data.id)
  },
)