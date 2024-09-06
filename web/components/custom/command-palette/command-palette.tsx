"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Command } from "cmdk"
import { Dialog, DialogPortal, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { CommandGroup } from "./command-items"
import { CommandAction, CommandItemType, createCommandGroups } from "./command-data"
import { useAccount } from "@/lib/providers/jazz-provider"
import { searchSafeRegExp, toTitleCase } from "@/lib/utils"
import { GraphNode } from "@/components/routes/public/PublicHomeRoute"
import { useCommandActions } from "./hooks/use-command-actions"

let graph_data_promise = import("@/components/routes/public/graph-data.json").then(a => a.default)

const filterItems = (items: CommandItemType[], searchRegex: RegExp) =>
	items.filter(item => searchRegex.test(item.label)).slice(0, 6)

export function CommandPalette() {
	const { me } = useAccount({ root: { personalLinks: [], personalPages: [] } })
	const dialogRef = React.useRef<HTMLDivElement | null>(null)
	const [inputValue, setInputValue] = React.useState("")
	const [activePage, setActivePage] = React.useState("home")
	const [open, setOpen] = React.useState(false)

	const actions = useCommandActions()
	const commandGroups = React.useMemo(() => me && createCommandGroups(actions, me), [actions, me])

	const raw_graph_data = React.use(graph_data_promise) as GraphNode[]

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				setOpen(prev => !prev)
			}
		}

		document.addEventListener("keydown", down)
		return () => document.removeEventListener("keydown", down)
	}, [])

	const bounce = React.useCallback(() => {
		if (dialogRef.current) {
			dialogRef.current.style.transform = "scale(0.99) translateX(-50%)"
			setTimeout(() => {
				if (dialogRef.current) {
					dialogRef.current.style.transform = ""
				}
			}, 100)
		}
	}, [])

	const handleKeyDown = React.useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter") {
				bounce()
			}

			if (activePage !== "home" && !inputValue && e.key === "Backspace") {
				e.preventDefault()
				setActivePage("home")
				setInputValue("")
				bounce()
			}
		},
		[activePage, inputValue, bounce]
	)

	const allCommands = React.useMemo(() => {
		if (!commandGroups) return []

		return Object.entries(commandGroups).map(([key, value]) => ({
			heading: toTitleCase(key),
			items: value.flatMap(subgroup => subgroup.items)
		}))
	}, [commandGroups])

	const topics = React.useMemo(
		() => ({
			heading: "Topics",
			items: raw_graph_data.map(topic => ({
				icon: "Circle" as const,
				label: topic?.prettyName || "",
				action: () => actions.navigateTo(`/${topic?.name}`)
			}))
		}),
		[raw_graph_data, actions]
	)

	const personalLinks = React.useMemo(
		() => ({
			heading: "Personal Links",
			items:
				me?.root.personalLinks?.map(link => ({
					icon: "Link" as const,
					label: link?.title || "Untitled",
					action: () => actions.openLinkInNewTab(link?.url || "#")
				})) || []
		}),
		[me?.root.personalLinks, actions]
	)

	const personalPages = React.useMemo(
		() => ({
			heading: "Personal Pages",
			items:
				me?.root.personalPages?.map(page => ({
					icon: "FileText" as const,
					label: page?.title || "Untitled",
					action: () => actions.navigateTo(`/pages/${page?.id}`)
				})) || []
		}),
		[me?.root.personalPages, actions]
	)

	const getFilteredCommands = React.useCallback(() => {
		if (!commandGroups) return []

		const searchRegex = searchSafeRegExp(inputValue)

		if (activePage === "home") {
			if (!inputValue) return commandGroups.home

			return [...allCommands, personalLinks, personalPages, topics]
				.map(group => ({
					heading: group.heading,
					items: filterItems(group.items, searchRegex)
				}))
				.filter(group => group.items.length > 0)
		}

		switch (activePage) {
			case "searchLinks":
				return [...commandGroups.searchLinks, { items: filterItems(personalLinks.items, searchRegex) }]
			case "searchPages":
				return [...commandGroups.searchPages, { items: filterItems(personalPages.items, searchRegex) }]
			default:
				const pageCommands = commandGroups[activePage]
				if (!inputValue) return pageCommands
				return pageCommands
					.map(group => ({
						heading: group.heading,
						items: filterItems(group.items, searchRegex)
					}))
					.filter(group => group.items.length > 0)
		}
	}, [inputValue, activePage, allCommands, personalLinks, personalPages, commandGroups, topics])

	const handleAction = React.useCallback(
		(action: CommandAction, payload?: any) => {
			const closeDialog = () => {
				setOpen(false)
			}

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
					} else {
						console.error(`Invalid page: ${payload}`)
					}
					break
				default:
					console.log(`Unhandled action: ${action}`)
					closeDialog()
			}
		},
		[bounce]
	)

	const filteredCommands = React.useMemo(() => getFilteredCommands(), [getFilteredCommands])

	const commandKey = React.useMemo(() => {
		return filteredCommands
			.map(group => {
				const itemsKey = group.items.map(item => `${item.label}-${item.action}`).join("|")
				return `${group.heading}:${itemsKey}`
			})
			.join("__")
	}, [filteredCommands])

	if (!me) return null

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogPortal>
				<DialogPrimitive.Overlay la-overlay="" cmdk-overlay="" />
				<DialogPrimitive.Content la-dialog="" cmdk-dialog="" className="la" ref={dialogRef}>
					<DialogHeader className="sr-only">
						<DialogTitle>Command Palette</DialogTitle>
						<DialogDescription>Search for commands and actions</DialogDescription>
					</DialogHeader>

					<Command key={commandKey} onKeyDown={handleKeyDown}>
						<div cmdk-input-wrapper="">
							<Command.Input
								autoFocus
								placeholder="Type a command or search..."
								value={inputValue}
								onValueChange={setInputValue}
							/>
						</div>

						<Command.List>
							<Command.Empty>No results found.</Command.Empty>
							{filteredCommands.map((group, index, array) => (
								<CommandGroup
									key={`${group.heading}-${index}`}
									heading={group.heading}
									items={group.items}
									handleAction={handleAction}
									isLastGroup={index === array.length - 1}
								/>
							))}
						</Command.List>
					</Command>
				</DialogPrimitive.Content>
			</DialogPortal>
		</Dialog>
	)
}