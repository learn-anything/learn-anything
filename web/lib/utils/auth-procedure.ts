import { currentUser } from "@clerk/nextjs/server"
import { createServerActionProcedure, ZSAError } from "zsa"

export const authedProcedure = createServerActionProcedure()
	.handler(async () => {
		try {
			const clerkUser = await currentUser()
			return { clerkUser }
		} catch {
			throw new ZSAError("NOT_AUTHORIZED", "User not authenticated")
		}
	})
	.createServerAction()
