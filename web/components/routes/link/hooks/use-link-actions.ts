import * as React from "react"
import { toast } from "sonner"
import { LaAccount, PersonalLink } from "@/lib/schema"

export const useLinkActions = () => {
	const deleteLink = React.useCallback((me: LaAccount, link: PersonalLink) => {
		if (!me.root?.personalLinks) return

		try {
			const index = me.root.personalLinks.findIndex(item => item?.id === link.id)
			if (index === -1) {
				console.error("Delete operation fail", { index, link })
				return
			}

			toast.success("Link deleted.", {
				position: "bottom-right",
				description: `${link.title} has been deleted.`
			})

			me.root.personalLinks.splice(index, 1)
		} catch (error) {
			toast.error("Failed to delete link")
		}
	}, [])

	return {
		deleteLink
	}
}
