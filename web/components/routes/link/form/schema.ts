import { z } from "zod"

export const createLinkSchema = z.object({
	url: z
		.string()
		.url({
			message: "Please enter a valid URL"
		})
		.min(1, { message: "URL can't be empty" }),
	icon: z.string().optional(),
	title: z.string().min(1, { message: "Title can't be empty" }),
	description: z.string().optional(),
	completed: z.boolean().default(false),
	notes: z.string().optional(),
	learningState: z.enum(["wantToLearn", "learning", "learned"]),
	topic: z.string().nullable().optional()
})

export type LinkFormValues = z.infer<typeof createLinkSchema>
