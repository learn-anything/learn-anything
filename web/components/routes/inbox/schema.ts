import { z } from "zod"

export const createInboxSchema = z.object({
  title: z
    .string({
      message: "Please enter a valid title"
    })
    .min(1, {
      message: "Please enter a valid title"
    }),
  description: z.string().optional(),
  topic: z.string().optional(),
  isLink: z.boolean().default(false),
  meta: z
    .object({
      url: z.string(),
      title: z.string(),
      image: z.string().optional().nullable(),
      favicon: z.string(),
      description: z.string().optional().nullable()
    })
    .optional()
    .nullable(),
  completed: z.boolean().default(false)
})
