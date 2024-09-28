"use server"

import { authedProcedure } from "@/lib/utils/auth-procedure"
import { currentUser } from "@clerk/nextjs/server"
import { get } from "ronin"
import { create } from "ronin"
import { z } from "zod"
import { ZSAError } from "zsa"

const MAX_FILE_SIZE = 1 * 1024 * 1024
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]

export const getFeatureFlag = authedProcedure
	.input(
		z.object({
			name: z.string()
		})
	)
	.handler(async ({ input }) => {
		const { name } = input
		const flag = await get.featureFlag.with.name(name)

		return { flag }
	})

export const sendFeedback = authedProcedure
	.input(
		z.object({
			content: z.string()
		})
	)
	.handler(async ({ input, ctx }) => {
		const { clerkUser } = ctx
		const { content } = input

		try {
			await create.feedback.with({
				message: content,
				emailFrom: clerkUser?.emailAddresses[0].emailAddress
			})
		} catch (error) {
			console.error(error)
			throw new ZSAError("ERROR", "Failed to send feedback")
		}
	})

export const storeImage = authedProcedure
	.input(
		z.object({
			file: z
				.any()
				.refine(file => file instanceof File, {
					message: "Not a file"
				})
				.refine(file => ALLOWED_FILE_TYPES.includes(file.type), {
					message: "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."
				})
				.refine(file => file.size <= MAX_FILE_SIZE, {
					message: "File size exceeds the maximum limit of 1 MB."
				})
		}),
		{ type: "formData" }
	)
	.handler(async ({ ctx, input }) => {
		const { file } = input
		const { clerkUser } = ctx

		if (!clerkUser?.id) {
			throw new ZSAError("NOT_AUTHORIZED", "You are not authorized to upload files")
		}

		try {
			const fileModel = await create.image.with({
				content: file,
				name: file.name,
				type: file.type,
				size: file.size
			})

			return { fileModel }
		} catch (error) {
			console.error(error)
			throw new ZSAError("ERROR", "Failed to store image")
		}
	})

export const isExistingUser = async () => {
	const clerkUser = await currentUser()
	const roninUser = await get.existingStripeSubscriber.with({ email: clerkUser?.emailAddresses[0].emailAddress })
	return clerkUser?.emailAddresses[0].emailAddress === roninUser?.email
}
