import * as React from "react"
import { toast } from "sonner"
import { LaAccount, PersonalPage } from "@/lib/schema"
import { ID } from "jazz-tools"
import { useNavigate } from "@tanstack/react-router"
import { useAccount } from "~/lib/providers/jazz-provider"

export const usePageActions = () => {
  const { me } = useAccount()
  const navigate = useNavigate()

  const newPage = React.useCallback(() => {
    if (!me) return

    const page = PersonalPage.create(
      { public: false, createdAt: new Date(), updatedAt: new Date() },
      { owner: me },
    )

    me.root?.personalPages?.push(page)

    navigate({ to: "/pages/$pageId", params: { pageId: page.id } })
  }, [me, navigate])

  const deletePage = React.useCallback(
    (me: LaAccount, pageId: ID<PersonalPage>): void => {
      if (!me.root?.personalPages) return

      const index = me.root.personalPages.findIndex(
        (item) => item?.id === pageId,
      )
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
          description: `${page.title} has been deleted.`,
        })
      } catch (error) {
        console.error("Failed to delete page", error)
        toast.error("Failed to delete page")
      }
    },
    [],
  )

  return { newPage, deletePage }
}
