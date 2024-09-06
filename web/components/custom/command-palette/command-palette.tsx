"use client"

import * as React from "react"
import { Command } from "cmdk"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Dialog, DialogPortal, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { CommandGroup } from "./command-items"
import { commandGroups, CommandItemType } from "./command-data"
import { useAccount } from "@/lib/providers/jazz-provider"
import { useRouter } from "next/navigation"
import { searchSafeRegExp } from "@/lib/utils"

type ActivePageType = keyof typeof commandGroups

const filterItems = (items: CommandItemType[], searchRegex: RegExp) =>
	items.filter(item => searchRegex.test(item.label))

export function CommandPalette() {
	const { me } = useAccount({ root: { personalLinks: [], personalPages: [] } })
	const ref = React.useRef<HTMLDivElement | null>(null)
	const router = useRouter()
	const [inputValue, setInputValue] = React.useState("")
	const [activePage, setActivePage] = React.useState<ActivePageType>("home")
	const [open, setOpen] = React.useState(false)
	const [key, setKey] = React.useState(0)
	const { setTheme } = useTheme()

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				setOpen(open => !open)
			}
		}

		document.addEventListener("keydown", down)
		return () => document.removeEventListener("keydown", down)
	}, [])

	React.useEffect(() => {
		setActivePage("home")
	}, [])

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			bounce()
		}

		if (activePage !== "home" && !inputValue && e.key === "Backspace") {
			e.preventDefault()
			setActivePage("home")
			bounce()
		}
	}

	const bounce = () => {
		if (ref.current) {
			ref.current.style.transform = "scale(0.99) translateX(-50%)"
			setTimeout(() => {
				if (ref.current) {
					ref.current.style.transform = ""
				}
			}, 100)
		}
	}

	const allCommands = React.useMemo(() => {
		return Object.entries(commandGroups).map(([key, value]) => ({
			heading: key,
			items: value.flatMap(subgroup => subgroup.items)
		}))
	}, [])

	const personalLinks = React.useMemo(
		() => ({
			heading: "Personal Links",
			items:
				me?.root.personalLinks?.map(link => ({
					icon: "Link" as const,
					label: link?.title || "Untitled",
					action: "NAVIGATE",
					payload: link?.url || "#"
				})) || []
		}),
		[me?.root.personalLinks]
	)

	const personalPages = React.useMemo(
		() => ({
			heading: "Personal Pages",
			items:
				me?.root.personalPages?.map(page => ({
					icon: "FileText" as const,
					label: page?.title || "Untitled",
					action: "NAVIGATE",
					payload: `/pages/${page?.id}`
				})) || []
		}),
		[me?.root.personalPages]
	)

	const getFilteredCommands = () => {
		const searchRegex = searchSafeRegExp(inputValue)

		if (activePage === "home") {
			if (!inputValue) return commandGroups.home

			const pages = [...allCommands, personalLinks, personalPages]
				.map(group => {
					const filteredItems = filterItems(group.items, searchRegex)
					return {
						heading: group.heading,
						items: filteredItems
					}
				})
				.filter(group => group.items.length > 0)

			return pages
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
					.map(group => {
						const items = filterItems(group.items, searchRegex)
						return {
							heading: group.heading,
							items
						}
					})
					.filter(group => group.items.length > 0)
		}
	}

	const handleAction = (action: string, payload?: any) => {
		switch (action) {
			case "CHANGE_THEME":
				setTheme(payload)
				toast.success(`Theme changed to ${payload}.`, { position: "bottom-right" })
				setOpen(false)
				break
			case "COPY_URL":
				navigator.clipboard.writeText(window.location.href)
				toast.success("URL copied to clipboard.", { position: "bottom-right" })
				setOpen(false)
				break
			case "CHANGE_PAGE":
				if (payload in commandGroups) {
					setActivePage(payload as ActivePageType)
					setInputValue("") // Clear the input when changing pages
				} else {
					console.error(`Invalid page: ${payload}`)
				}
				break
			case "NAVIGATE":
				router.push(payload)
				setOpen(false)
				break
			default:
				console.log(`Unhandled action: ${action}`)
		}
	}

	const filteredCommands = React.useMemo(() => {
		const commands = getFilteredCommands()
		return commands
	}, [inputValue, activePage, me?.root.personalLinks, me?.root.personalPages])

	React.useEffect(() => {
		setKey(prevKey => prevKey + 1)
	}, [filteredCommands])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogPortal>
				<DialogPrimitive.Overlay la-overlay="" cmdk-overlay="" />
				<DialogPrimitive.Content la-dialog="" cmdk-dialog="" className="la" ref={ref}>
					<DialogHeader className="sr-only">
						<DialogTitle>Command Palette</DialogTitle>
						<DialogDescription>Search for commands and actions</DialogDescription>
					</DialogHeader>

					<Command key={key} onKeyDown={handleKeyDown}>
						<div cmdk-input-wrapper="">
							<div className="flex items-center">
								<Command.Input
									autoFocus
									placeholder="Type a command or search..."
									value={inputValue}
									onValueChange={setInputValue}
								/>
							</div>
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
