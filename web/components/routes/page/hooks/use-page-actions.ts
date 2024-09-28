import { useCallback } from "react"
import { toast } from "sonner"
import { LaAccount, PersonalPage } from "@/lib/schema"
import { ID } from "jazz-tools"

export const usePageActions = () => {
	const newPage = useCallback((me: LaAccount): PersonalPage => {
		const newPersonalPage = PersonalPage.create(
			{ public: false, createdAt: new Date(), updatedAt: new Date() },
			{ owner: me._owner }
		)
		me.root?.personalPages?.push(newPersonalPage)
		return newPersonalPage
	}, [])

	const deletePage = useCallback((me: LaAccount, pageId: ID<PersonalPage>): void => {
		if (!me.root?.personalPages) return

		const index = me.root.personalPages.findIndex(item => item?.id === pageId)
		if (index === -1) {
			toast.error("Page not found")
			return
		}

		const page = me.root.personalPages[index]
		if (!page) {
			toast.error("Page data is invalid")
			return
		}

		try {
			me.root.personalPages.splice(index, 1)

			toast.success("Page deleted", {
				position: "bottom-right",
				description: `${page.title} has been deleted.`
			})
		} catch (error) {
			console.error("Failed to delete page", error)
			toast.error("Failed to delete page")
		}
	}, [])

	return { newPage, deletePage }
}
