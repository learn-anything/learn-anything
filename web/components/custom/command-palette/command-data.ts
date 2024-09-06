import { icons } from "lucide-react"
import { useCommandActions } from "./hooks/use-command-actions"
import { LaAccount } from "@/lib/schema"

export type CommandAction = string | (() => void)

export type CommandItemType = {
	icon?: keyof typeof icons
	label: string
	action: CommandAction
	payload?: any
	shortcut?: string
}

export type CommandGroupType = {
	heading?: string
	items: CommandItemType[]
}[]

export const createCommandGroups = (
	actions: ReturnType<typeof useCommandActions>,
	me: LaAccount
): Record<string, CommandGroupType> => ({
	home: [
		{
			heading: "General",
			items: [
				{ icon: "SunMoon", label: "Change Theme...", action: "CHANGE_PAGE", payload: "changeTheme" },
				{
					icon: "Copy",
					label: "Copy Current URL",
					action: actions.copyCurrentURL
				}
			]
		},
		{
			heading: "Personal Links",
			items: [
				{ icon: "TextSearch", label: "Search Links...", action: "CHANGE_PAGE", payload: "searchLinks" },
				{ icon: "Plus", label: "Create New Link...", action: () => actions.navigateTo("/") }
			]
		},
		{
			heading: "Personal Pages",
			items: [
				{ icon: "FileSearch", label: "Search Pages...", action: "CHANGE_PAGE", payload: "searchPages" },
				{
					icon: "Plus",
					label: "Create New Page...",
					action: () => actions.createNewPage(me)
				}
			]
		}
	],
	searchLinks: [],
	searchPages: [],
	topics: [],
	changeTheme: [
		{
			items: [
				{ icon: "Moon", label: "Change Theme to Dark", action: () => actions.changeTheme("dark") },
				{ icon: "Sun", label: "Change Theme to Light", action: () => actions.changeTheme("light") },
				{ icon: "Monitor", label: "Change Theme to System", action: () => actions.changeTheme("system") }
			]
		}
	]
})
