import { icons } from "lucide-react"
import { HTMLLikeElement } from "@/lib/utils"
import { useCommandActions } from "~/hooks/actions/use-command-actions"

export type CommandAction = string | (() => void)

export interface CommandItemType {
  id?: string
  icon?: keyof typeof icons
  value: string
  label: HTMLLikeElement | string
  action: CommandAction
  payload?: any
  shortcut?: string
}

export type CommandGroupType = Array<{
  heading?: string
  items: CommandItemType[]
}>

const createNavigationItem = (
  icon: keyof typeof icons,
  value: string,
  path: string,
  actions: ReturnType<typeof useCommandActions>,
): CommandItemType => ({
  icon,
  value: `Go to ${value}`,
  label: {
    tag: "span",
    children: [
      "Go to ",
      {
        tag: "span",
        attributes: { className: "font-semibold" },
        children: [value],
      },
    ],
  },
  action: () => actions.navigateTo(path),
})

export const createCommandGroups = (
  actions: ReturnType<typeof useCommandActions>,
): Record<string, CommandGroupType> => ({
  home: [
    {
      heading: "General",
      items: [
        {
          icon: "SunMoon",
          value: "Change Theme...",
          label: "Change Theme...",
          action: "CHANGE_PAGE",
          payload: "changeTheme",
        },
        {
          icon: "Copy",
          value: "Copy Current URL",
          label: "Copy Current URL",
          action: actions.copyCurrentURL,
        },
      ],
    },
    {
      heading: "Personal Links",
      items: [
        {
          icon: "TextSearch",
          value: "Search Links...",
          label: "Search Links...",
          action: "CHANGE_PAGE",
          payload: "searchLinks",
        },
        {
          icon: "Plus",
          value: "Create New Link...",
          label: "Create New Link...",
          action: () => actions.navigateTo("/links?create=true"),
        },
      ],
    },
    {
      heading: "Personal Pages",
      items: [
        {
          icon: "FileSearch",
          value: "Search Pages...",
          label: "Search Pages...",
          action: "CHANGE_PAGE",
          payload: "searchPages",
        },
        {
          icon: "Plus",
          value: "Create New Page...",
          label: "Create New Page...",
          action: () => actions.createNewPage(),
        },
      ],
    },
    {
      heading: "Navigation",
      items: [
        createNavigationItem("ArrowRight", "Links", "/links", actions),
        createNavigationItem("ArrowRight", "Pages", "/pages", actions),
        createNavigationItem("ArrowRight", "Search", "/search", actions),
        createNavigationItem("ArrowRight", "Profile", "/profile", actions),
        createNavigationItem("ArrowRight", "Settings", "/settings", actions),
      ],
    },
  ],
  searchLinks: [],
  searchPages: [],
  topics: [],
  changeTheme: [
    {
      items: [
        {
          icon: "Moon",
          value: "Change Theme to Dark",
          label: "Change Theme to Dark",
          action: () => actions.changeTheme("dark"),
        },
        {
          icon: "Sun",
          value: "Change Theme to Light",
          label: "Change Theme to Light",
          action: () => actions.changeTheme("light"),
        },
        {
          icon: "Monitor",
          value: "Change Theme to System",
          label: "Change Theme to System",
          action: () => actions.changeTheme("system"),
        },
      ],
    },
  ],
})
