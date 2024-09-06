import { icons } from "lucide-react"

export type CommandItemType = {
	icon?: keyof typeof icons
	label: string
	action: string
	payload?: any
	shortcut?: string
}

export type CommandGroupType = {
	heading?: string
	items: CommandItemType[]
}[]

export const commandGroups: Record<string, CommandGroupType> = {
	home: [
		{
			heading: "General",
			items: [
				{ icon: "SunMoon", label: "Change Theme...", action: "CHANGE_PAGE", payload: "changeTheme" },
				{ icon: "Copy", label: "Copy Current URL", action: "COPY_URL" }
			]
		},
		{
			heading: "Personal Links",
			items: [
				{ icon: "TextSearch", label: "Search Links...", action: "CHANGE_PAGE", payload: "searchLinks" },
				{ icon: "Plus", label: "Create New Link...", action: "NAVIGATE", payload: "/" }
			]
		},
		{
			heading: "Personal Pages",
			items: [
				{ icon: "FileSearch", label: "Search Pages...", action: "CHANGE_PAGE", payload: "searchPages" },
				{ icon: "Plus", label: "Create New Page...", action: "NAVIGATE", payload: "/" }
			]
		}
	],
	searchLinks: [],
	searchPages: [],
	topics: [],
	changeTheme: [
		{
			items: [
				{ icon: "Moon", label: "Change Theme to Dark", action: "CHANGE_THEME", payload: "dark" },
				{ icon: "Sun", label: "Change Theme to Light", action: "CHANGE_THEME", payload: "light" },
				{ icon: "Monitor", label: "Change Theme to System", action: "CHANGE_THEME", payload: "system" }
			]
		}
	]
}
