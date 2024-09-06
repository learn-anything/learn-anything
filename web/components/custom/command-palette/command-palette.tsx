"use client"

import * as React from "react"
import { Command } from "cmdk"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Dialog, DialogPortal, DialogHeader, DialogTitle, DialogDescription } from "../../ui/dialog"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { CommandGroup } from "./command-items"
import { commandGroups, CommandItemType } from "./command-data"
import { useAccount } from "@/lib/providers/jazz-provider"
import { useRouter } from "next/navigation"

type ActivePageType = keyof typeof commandGroups

export function CommandPalette() {
	const { me } = useAccount({ root: { personalLinks: [], personalPages: [] } })
	const ref = React.useRef<HTMLDivElement | null>(null)
	const router = useRouter()
	const [inputValue, setInputValue] = React.useState("")
	const [activePage, setActivePage] = React.useState<ActivePageType>("home")
	const [open, setOpen] = React.useState(false)
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

	const getCommandGroups = () => {
		if (activePage === "searchLinks") {
			if (!me?.root.personalLinks) return []

			return [
				{
					items: me.root.personalLinks.map(link => {
						const item: CommandItemType = {
							icon: "Link",
							label: link?.title || "Untitled",
							action: "NAVIGATE",
							payload: link?.url || "#"
						}

						return item
					})
				}
			]
		}

		if (activePage === "searchPages") {
			if (!me?.root.personalPages) return []

			return [
				{
					items: me.root.personalPages.map(page => {
						const item: CommandItemType = {
							icon: "FileText",
							label: page?.title || "Untitled",
							action: "NAVIGATE",
							payload: `/pages/${page?.id}`
						}

						return item
					})
				}
			]
		}

		return commandGroups[activePage]
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogPortal>
				<DialogPrimitive.Overlay la-overlay="" cmdk-overlay="" />
				<DialogPrimitive.Content la-dialog="" cmdk-dialog="" className="la" ref={ref}>
					<DialogHeader className="sr-only">
						<DialogTitle>Command Palette</DialogTitle>
						<DialogDescription>Search for commands and actions</DialogDescription>
					</DialogHeader>

					<Command onKeyDown={handleKeyDown}>
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
							{getCommandGroups().map((group, index, array) => (
								<CommandGroup
									key={index}
									{...group}
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
