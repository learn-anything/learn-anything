"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState, KeyboardEvent as ReactKeyboardEvent } from "react"
import { Icon } from "../la-editor/components/ui/icon"
import { linkShowCreateAtom } from "@/store/link"
import { generateUniqueSlug } from "@/lib/utils"
import { useAtom } from "jotai"
import { PersonalPage } from "@/lib/schema/personal-page"
import { useRouter } from "next/navigation"
import { useAccount } from "@/lib/providers/jazz-provider"
import { toast } from "sonner"

export function CommandPalette() {
	const [showPalette, setShowPalette] = useState(false)
	const [showCreate, setShowCreate] = useAtom(linkShowCreateAtom)
	const router = useRouter()
	const { me } = useAccount()

	const [commands, setCommands] = useState<
		{ name: string; icon?: React.ReactNode; keybind?: string[]; action: () => void }[]
	>([
		{
			name: "Create new link",
			icon: <Icon name="Link" />,
			// keybind: ["Ctrl", "K"],
			action: () => {
				if (window.location.pathname !== "/") {
					router.push("/")
				}
				setShowCreate(true)
			}
		},
		{
			name: "Create page",
			icon: <Icon name="File" />,
			// keybind: ["Ctrl", "P"],
			action: () => {
				const personalPages = me?.root?.personalPages?.toJSON() || []
				const slug = generateUniqueSlug(personalPages, "Untitled Page")

				const newPersonalPage = PersonalPage.create(
					{
						title: "Untitled Page",
						slug: slug,
						content: ""
					},
					{ owner: me._owner }
				)

				me.root?.personalPages?.push(newPersonalPage)

				router.push(`/pages/${newPersonalPage.id}`)
			}
		}
		// {
		// 	name: "Assign status..",
		// 	// icon: <Icon name="File" />,
		// 	// keybind: ["Ctrl", "P"],
		// 	action: () => {}
		// }
	])
	const [searchTerm, setSearchTerm] = useState("")
	const [commandResults, setCommandResults] = useState(commands)
	const [selectedIndex, setSelectedIndex] = useState(0)

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key === "k") {
				event.preventDefault()
				setShowPalette(prev => !prev)
			} else if (showPalette) {
				if (["Escape", "Enter", "ArrowDown", "ArrowUp"].includes(event.key)) {
					event.preventDefault()
					event.stopPropagation()

					// Handle the key events here
					if (event.key === "Escape") {
						setShowPalette(false)
					} else if (event.key === "Enter" && commandResults.length > 0) {
						commandResults[selectedIndex].action()
						setShowPalette(false)
					} else if (event.key === "ArrowDown") {
						setSelectedIndex(prevIndex => (prevIndex < commandResults.length - 1 ? prevIndex + 1 : prevIndex))
					} else if (event.key === "ArrowUp") {
						setSelectedIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : prevIndex))
					}
				}
			}
		}

		document.addEventListener("keydown", handleKeyDown, true)

		return () => {
			document.removeEventListener("keydown", handleKeyDown, true)
		}
	}, [showPalette, commandResults, selectedIndex])

	// Remove the separate handleKeyDown function for the input
	// as we're now handling all key events in the global listener

	if (!showPalette) return null

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.9 }}
				className="fixed left-0 top-0 z-[100] flex h-screen w-screen justify-center pt-[100px]"
				onClick={() => setShowPalette(false)}
			>
				<div
					role="dialog"
					aria-modal="true"
					aria-label="Command Palette"
					onClick={e => e.stopPropagation()}
					className="relative h-fit w-[600px] rounded-lg border border-slate-400/20 bg-white drop-shadow-xl dark:bg-neutral-900"
				>
					<div className="flex items-center gap-3 border-b border-slate-400/20 p-4">
						<Icon name="Search" className="h-[20px] w-[20px] opacity-70" aria-hidden="true" />
						<input
							type="text"
							className="w-full bg-transparent text-[18px] outline-none"
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							placeholder="Search commands..."
							aria-label="Search commands"
							autoFocus
						/>
					</div>
					<ul className="flex h-full max-h-[500px] flex-col gap-2 p-2 text-[12px]" role="listbox">
						{commandResults.map((command, index) => (
							<li
								key={index}
								role="option"
								aria-selected={index === selectedIndex}
								className={`flex w-full cursor-pointer items-center justify-between rounded-lg p-3 transition-all ${
									index === selectedIndex
										? "bg-gray-100 dark:bg-neutral-800"
										: "hover:bg-gray-100 dark:hover:bg-neutral-800"
								}`}
								onClick={() => {
									command.action()
									setShowPalette(false)
								}}
							>
								<div className="flex items-center gap-2">
									<span className="h-4 w-4" aria-hidden="true">
										{command.icon}
									</span>

									<span>{command.name}</span>
								</div>
								{command.keybind && (
									<div className="flex items-center gap-1 opacity-60">
										{command.keybind.map(key => (
											<kbd
												key={key}
												className="flex h-[24px] w-fit min-w-[24px] items-center justify-center rounded-md bg-gray-200 px-2 dark:bg-neutral-700/60"
											>
												{key}
											</kbd>
										))}
									</div>
								)}
							</li>
						))}
						{commandResults.length === 0 && (
							<li className="p-3 text-center text-sm text-slate-400">No results found</li>
						)}
					</ul>
				</div>
			</motion.div>
		</AnimatePresence>
	)
}
