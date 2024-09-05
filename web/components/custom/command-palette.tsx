"use client"

import * as React from "react"
import { Calculator, Calendar, CreditCard, Settings, Smile, User } from "lucide-react"
import { Command as CommandPrimitive } from "cmdk"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { CommandGroup, CommandSeparator, CommandShortcut } from "@/components/ui/command"
import { Dialog, DialogPortal, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"

export function CommandPalette() {
	const [open, setOpen] = React.useState(false)

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

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogPortal>
				<DialogPrimitive.Overlay la-overlay="" cmdk-overlay="" />
				<DialogPrimitive.Content la-dialog="" cmdk-dialog="" className="la">
					<DialogHeader className="sr-only">
						<DialogTitle>Command Palette</DialogTitle>
						<DialogDescription>Search for commands and actions</DialogDescription>
					</DialogHeader>

					<CommandPrimitive>
						<div cmdk-input-wrapper="">
							<div className="flex items-center">
								<CommandPrimitive.Input placeholder="Type a command or search..." />
							</div>
						</div>

						<CommandPrimitive.List>
							<CommandPrimitive.Empty>No results found.</CommandPrimitive.Empty>
							<CommandPrimitive.Group heading="Suggestions">
								<CommandPrimitive.Item>
									<Calendar className="mr-2 h-4 w-4" />
									<span>Calendar</span>
								</CommandPrimitive.Item>
								<CommandPrimitive.Item>
									<Smile className="mr-2 h-4 w-4" />
									<span>Search Emoji</span>
								</CommandPrimitive.Item>
								<CommandPrimitive.Item>
									<Calculator className="mr-2 h-4 w-4" />
									<span>Calculator</span>
								</CommandPrimitive.Item>
							</CommandPrimitive.Group>
							<CommandSeparator className="my-1.5" />
							<CommandGroup heading="Settings">
								<CommandPrimitive.Item>
									<User className="mr-2 h-4 w-4" />
									<span>Profile</span>
									<CommandShortcut>⌘P</CommandShortcut>
								</CommandPrimitive.Item>
								<CommandPrimitive.Item>
									<CreditCard className="mr-2 h-4 w-4" />
									<span>Billing</span>
									<CommandShortcut>⌘B</CommandShortcut>
								</CommandPrimitive.Item>
								<CommandPrimitive.Item>
									<Settings className="mr-2 h-4 w-4" />
									<span>Settings</span>
									<CommandShortcut>⌘S</CommandShortcut>
								</CommandPrimitive.Item>
							</CommandGroup>
						</CommandPrimitive.List>
					</CommandPrimitive>
				</DialogPrimitive.Content>
			</DialogPortal>
		</Dialog>
	)
}
