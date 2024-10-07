import * as React from "react"
import { toast } from "sonner"
import { LaAccount, PersonalLink } from "@/lib/schema"

export const useLinkActions = () => {
  const deleteLink = React.useCallback((me: LaAccount, link: PersonalLink) => {
    if (!me.root?.personalLinks) return

    try {
      const index = me.root.personalLinks.findIndex(
        (item) => item?.id === link.id,
      )
      if (index === -1) {
        throw new Error(`Link with id ${link.id} not found`)
      }

      me.root.personalLinks.splice(index, 1)

      toast.success("Link deleted.", {
        position: "bottom-right",
        description: `${link.title} has been deleted.`,
      })
    } catch (error) {
      console.error("Failed to delete link:", error)
      toast.error("Failed to delete link", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      })
    }
  }, [])

  return {
    deleteLink,
  }
}
