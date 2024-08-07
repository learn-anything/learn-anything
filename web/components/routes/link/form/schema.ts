import { z } from "zod"

export const createLinkSchema = z.object({
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
			favicon: z.string(),
			description: z.string().optional().nullable()
		})
		.optional()
		.nullable(),
	completed: z.boolean().default(false)
})
