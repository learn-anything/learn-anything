import { z } from "zod"
import { urlSchema } from "~/lib/utils/schema"

export const createLinkSchema = z.object({
  url: urlSchema,
  icon: z.string().optional(),
  title: z.string().min(1, { message: "Title can't be empty" }),
  description: z.string().optional(),
  completed: z.boolean().default(false),
  notes: z.string().optional(),
  learningState: z.enum(["wantToLearn", "learning", "learned"]).optional(),
  topic: z.string().nullable().optional(),
})

export type LinkFormValues = z.infer<typeof createLinkSchema>
