import { z } from "zod"
import { isUrl } from "@/lib/utils"

export const createLinkSchema = z.object({
	title: z.string().min(1, { message: "Title can't be empty" }),
	originalUrl: z.string().refine(isUrl, { message: "Only links are allowed" }),
	learningState: z.enum(["wantToLearn", "learning", "learned"]).optional(),
	description: z.string().optional(),
	topic: z.string().optional(),
	isLink: z.boolean().default(true),
	meta: z
		.object({
			url: z.string(),
			title: z.string(),
			favicon: z.string(),
			description: z.string().optional().nullable()
		})
		.optional()
		.nullable(),
	completed: z.boolean().default(false),
	notes: z.string().optional()
})
