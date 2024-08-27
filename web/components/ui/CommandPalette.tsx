"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState, KeyboardEvent as ReactKeyboardEvent } from "react"
import { Icon } from "../la-editor/components/ui/icon"

export function CommandPalette() {
	const [showPalette, setShowPalette] = useState(false)
	const [commands, setCommands] = useState<
		{ name: string; icon?: React.ReactNode; keybind?: string[]; action: () => void }[]
	>([
		{
			name: "Create new link",
			icon: <Icon name="FilePlus" />,
			keybind: ["Ctrl", "K"],
			action: () => {
				console.log("Creating new link")
			}
		},
		{
			name: "Create page",
			keybind: ["Ctrl", "P"],
			action: () => {
				console.log("Creating new page")
			}
		}
	])
	const [searchTerm, setSearchTerm] = useState("")
	const [commandResults, setCommandResults] = useState(commands)
	const [selectedIndex, setSelectedIndex] = useState(0)

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key === "k") {
				event.preventDefault()
				setShowPalette(true)
			}
		}

		document.addEventListener("keydown", handleKeyDown)

		return () => {
			document.removeEventListener("keydown", handleKeyDown)
		}
	}, [])

	useEffect(() => {
		const filteredCommands = commands.filter(command => command.name.toLowerCase().includes(searchTerm.toLowerCase()))
		setCommandResults(filteredCommands)
		setSelectedIndex(0)
	}, [searchTerm, commands])

	const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter" && commandResults.length > 0) {
			event.preventDefault()
			commandResults[selectedIndex].action()
			setShowPalette(false)
		} else if (event.key === "ArrowDown") {
			event.preventDefault()
			setSelectedIndex(prevIndex => (prevIndex < commandResults.length - 1 ? prevIndex + 1 : prevIndex))
		} else if (event.key === "ArrowUp") {
			event.preventDefault()
			setSelectedIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : prevIndex))
		}
	}

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
							onKeyDown={handleKeyDown}
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
