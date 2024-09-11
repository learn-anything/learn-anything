import { XIcon } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { showHotkeyPanelAtom } from "@/store/sidebar"
import { useAtom } from "jotai/react"

export default function SlidingMenu() {
	const [isOpen, setIsOpen] = useAtom(showHotkeyPanelAtom)
	const panelRef = useRef<HTMLDivElement>(null)
	const [shortcuts] = useState<{ name: string; shortcut: string[] }[]>([
		// TODO: change to better keybind
		// TODO: windows users don't understand these symbols, figure out better way to show keybinds
		{ name: "New Todo", shortcut: ["⌘", "⌃", "n"] },
		{ name: "CMD Palette", shortcut: ["⌘", "k"] }
		// TODO: add
		// { name: "Global Search", shortcut: ["."] },
		// { name: "(/pages)", shortcut: [".", "."] }
	])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside)
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [isOpen, setIsOpen])

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-[99] bg-black bg-opacity-50"
						onClick={() => setIsOpen(false)}
					/>
					<motion.div
						ref={panelRef}
						initial={{ x: "100%" }}
						animate={{ x: 0 }}
						exit={{ x: "100%", transition: { duration: 0.1, ease: "easeIn" } }}
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
						className="fixed right-0 top-0 z-[100] h-full p-4"
					>
						<div className="flex h-full w-[300px] flex-col gap-4 rounded-lg border border-slate-400/20 bg-white p-3 pl-4 drop-shadow-md dark:bg-neutral-950">
							<div className="flex flex-row items-center justify-between gap-4">
								<div className="">Shortcuts</div>
								<button
									onClick={() => setIsOpen(false)}
									className="flex h-[28px] w-[28px] items-center justify-center rounded-md border border-slate-400/20 text-black/60 dark:text-white/60"
								>
									<XIcon className="h-[16px] w-[16px]" />
								</button>
							</div>
							<div className="flex flex-col gap-1 text-[12px]">
								{shortcuts.map((shortcut, index) => (
									<div key={index} className="flex flex-row items-center justify-between gap-4">
										<div className="opacity-40">{shortcut.name}</div>
										<div className="flex min-w-[20px] items-center justify-center rounded-sm bg-neutral-900 p-1 px-2">
											{shortcut.shortcut.join(" ")}
										</div>
									</div>
								))}
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	)
}
