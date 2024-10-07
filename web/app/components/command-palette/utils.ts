import { GraphData } from "~/lib/constants"
import { CommandAction, CommandItemType } from "./command-data"

export const filterItems = (items: CommandItemType[], searchRegex: RegExp) =>
  items.filter((item) => searchRegex.test(item.value)).slice(0, 10)

export const getTopics = (actions: { navigateTo: (path: string) => void }) => ({
  heading: "Topics",
  items: GraphData.map((topic) => ({
    icon: "Circle" as const,
    value: topic?.prettyName || "",
    label: topic?.prettyName || "",
    action: () => actions.navigateTo(`/${topic?.name}`),
  })),
})

export const getPersonalLinks = (
  personalLinks: any[],
  actions: { openLinkInNewTab: (url: string) => void },
) => ({
  heading: "Personal Links",
  items: personalLinks.map((link) => ({
    id: link?.id,
    icon: "Link" as const,
    value: link?.title || "Untitled",
    label: link?.title || "Untitled",
    action: () => actions.openLinkInNewTab(link?.url || "#"),
  })),
})

export const getPersonalPages = (
  personalPages: any[],
  actions: { navigateTo: (path: string) => void },
) => ({
  heading: "Personal Pages",
  items: personalPages.map((page) => ({
    id: page?.id,
    icon: "FileText" as const,
    value: page?.title || "Untitled",
    label: page?.title || "Untitled",
    action: () => actions.navigateTo(`/pages/${page?.id}`),
  })),
})

export const handleAction = (
  action: CommandAction,
  payload: any,
  callbacks: {
    setActivePage: (page: string) => void
    setInputValue: (value: string) => void
    bounce: () => void
    closeDialog: () => void
  },
) => {
  const { setActivePage, setInputValue, bounce, closeDialog } = callbacks

  if (typeof action === "function") {
    action()
    closeDialog()
    return
  }

  switch (action) {
    case "CHANGE_PAGE":
      if (payload) {
        setActivePage(payload)
        setInputValue("")
        bounce()
      }
      break
    default:
      closeDialog()
  }
}
