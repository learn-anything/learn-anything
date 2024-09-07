import { icons } from "lucide-react"
import { useCommandActions } from "./hooks/use-command-actions"
import { LaAccount } from "@/lib/schema"
import { HTMLLikeElement } from "@/lib/utils"

export type CommandAction = string | (() => void)

export type CommandItemType = {
	icon?: keyof typeof icons
	value: string
	label: HTMLLikeElement | string
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
				{
					icon: "SunMoon",
					value: "Change Theme...",
					label: "Change Theme...",
					action: "CHANGE_PAGE",
					payload: "changeTheme"
				},
				{
					icon: "Copy",
					value: "Copy Current URL",
					label: "Copy Current URL",
					action: actions.copyCurrentURL
				}
			]
		},
		{
			heading: "Personal Links",
			items: [
				{
					icon: "TextSearch",
					value: "Search Links...",
					label: "Search Links...",
					action: "CHANGE_PAGE",
					payload: "searchLinks"
				},
				{
					icon: "Plus",
					value: "Create New Link...",
					label: "Create New Link...",
					action: () => actions.navigateTo("/")
				}
			]
		},
		{
			heading: "Personal Pages",
			items: [
				{
					icon: "FileSearch",
					value: "Search Pages...",
					label: "Search Pages...",
					action: "CHANGE_PAGE",
					payload: "searchPages"
				},
				{
					icon: "Plus",
					value: "Create New Page...",
					label: "Create New Page...",
					action: () => actions.createNewPage(me)
				}
			]
		},
		{
			heading: "Navigation",
			items: [
				{
					icon: "ArrowRight",
					value: "Go to Links",
					label: {
						tag: "span",
						children: ["Go to ", { tag: "span", attributes: { className: "font-semibold" }, children: ["links"] }]
					},
					action: () => actions.navigateTo("/links")
				},
				{
					icon: "ArrowRight",
					value: "Go to Pages",
					label: {
						tag: "span",
						children: ["Go to ", { tag: "span", attributes: { className: "font-semibold" }, children: ["pages"] }]
					},
					action: () => actions.navigateTo("/pages")
				},
				{
					icon: "ArrowRight",
					value: "Go to Search",
					label: {
						tag: "span",
						children: ["Go to ", { tag: "span", attributes: { className: "font-semibold" }, children: ["search"] }]
					},
					action: () => actions.navigateTo("/search")
				},
				{
					icon: "ArrowRight",
					value: "Go to Profile",
					label: {
						tag: "span",
						children: ["Go to ", { tag: "span", attributes: { className: "font-semibold" }, children: ["profile"] }]
					},
					action: () => actions.navigateTo("/profile")
				},
				{
					icon: "ArrowRight",
					value: "Go to Settings",
					label: {
						tag: "span",
						children: ["Go to ", { tag: "span", attributes: { className: "font-semibold" }, children: ["settings"] }]
					},
					action: () => actions.navigateTo("/settings")
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
				{
					icon: "Moon",
					value: "Change Theme to Dark",
					label: "Change Theme to Dark",
					action: () => actions.changeTheme("dark")
				},
				{
					icon: "Sun",
					value: "Change Theme to Light",
					label: "Change Theme to Light",
					action: () => actions.changeTheme("light")
				},
				{
					icon: "Monitor",
					value: "changeThemeToSystem",
					label: "Change Theme to System",
					action: () => actions.changeTheme("system")
				}
			]
		}
	]
})
