import * as React from "react"
import { ensureUrlProtocol } from "@/lib/utils"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { LaAccount } from "@/lib/schema"
import { usePageActions } from "./actions/use-page-actions"
import { useNavigate } from "@tanstack/react-router"

export const useCommandActions = () => {
  const { setTheme } = useTheme()
  const navigate = useNavigate()
  const { newPage } = usePageActions()

  const changeTheme = React.useCallback(
    (theme: string) => {
      setTheme(theme)
      toast.success(`Theme changed to ${theme}.`, { position: "bottom-right" })
    },
    [setTheme],
  )

  const navigateTo = React.useCallback(
    (path: string) => {
      navigate({ to: path })
    },
    [navigate],
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
      navigate({ to: `/pages/${page.id}` })
    },
    [navigate, newPage],
  )

  return {
    changeTheme,
    navigateTo,
    openLinkInNewTab,
    copyCurrentURL,
    createNewPage,
  }
}
