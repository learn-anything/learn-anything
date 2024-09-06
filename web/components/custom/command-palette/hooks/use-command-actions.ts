import * as React from "react"
import { ensureUrlProtocol } from "@/lib/utils"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { LaAccount, PersonalPage } from "@/lib/schema"

export const useCommandActions = () => {
	const { setTheme } = useTheme()
	const router = useRouter()

	const changeTheme = React.useCallback(
		(theme: string) => {
			setTheme(theme)
			toast.success(`Theme changed to ${theme}.`, { position: "bottom-right" })
		},
		[setTheme]
	)

	const navigateTo = React.useCallback(
		(path: string) => {
			router.push(path)
		},
		[router]
	)

	const openLinkInNewTab = React.useCallback((url: string) => {
		window.open(ensureUrlProtocol(url), "_blank")
	}, [])

	const copyCurrentURL = React.useCallback(() => {
		navigator.clipboard.writeText(window.location.href)
		toast.success("URL copied to clipboard.", { position: "bottom-right" })
	}, [])

	const createNewPage = React.useCallback(
		(me: LaAccount) => {
			try {
				const newPersonalPage = PersonalPage.create(
					{ public: false, createdAt: new Date(), updatedAt: new Date() },
					{ owner: me._owner }
				)

				me.root?.personalPages?.push(newPersonalPage)
				router.push(`/pages/${newPersonalPage.id}`)
			} catch (error) {
				toast.error("Failed to create page")
			}
		},
		[router]
	)

	return {
		changeTheme,
		navigateTo,
		openLinkInNewTab,
		copyCurrentURL,
		createNewPage
	}
}
