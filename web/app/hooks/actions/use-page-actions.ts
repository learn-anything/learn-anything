import * as React from "react"
import { toast } from "sonner"
import { PersonalPage } from "@/lib/schema"
import { ID } from "jazz-tools"
import { useNavigate } from "@tanstack/react-router"
import { useAccountOrGuest } from "~/lib/providers/jazz-provider"

export const usePageActions = () => {
  const { me: account } = useAccountOrGuest()
  const navigate = useNavigate()

  const createNewPage = React.useCallback(async () => {
    try {
      const isValidAccount = account && account._type === "Account"
      if (!isValidAccount) return

      const page = PersonalPage.create(
        {
          public: false,
          topic: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { owner: account },
      )

      account.root?.personalPages?.push(page)

      navigate({
        to: "/pages/$pageId",
        params: { pageId: page.id },
        replace: true,
      })
    } catch (error) {
      console.error(error)
    }
  }, [account, navigate])

  const deletePage = React.useCallback(
    (pageId: ID<PersonalPage>): void => {
      const isValidAccount = account && account._type === "Account"
      if (!isValidAccount) return

      const found = account.root?.personalPages?.findIndex(
        (item) => item?.id === pageId,
      )

      if (found !== undefined && found > -1) {
        account.root?.personalPages?.splice(found, 1)

        toast.success("Page deleted", {
          description: "The page has been deleted",
        })
      }
    },
    [account],
  )

  return { createNewPage, deletePage }
}
