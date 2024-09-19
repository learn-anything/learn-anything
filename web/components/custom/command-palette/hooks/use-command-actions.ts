import * as React from "react"
import { ensureUrlProtocol } from "@/lib/utils"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { LaAccount } from "@/lib/schema"
import { usePageActions } from "@/components/routes/page/hooks/use-page-actions"

export const useCommandActions = () => {
	const { setTheme } = useTheme()
	const router = useRouter()
	const { newPage } = usePageActions()

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
			const page = newPage(me)
			router.push(`/pages/${page.id}`)
		},
		[router, newPage]
	)

	return {
		changeTheme,
		navigateTo,
		openLinkInNewTab,
		copyCurrentURL,
		createNewPage
	}
}
