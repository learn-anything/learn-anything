"use client"
import { useAccount } from "@/lib/providers/jazz-provider"
import { useState, useCallback, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Icon } from "../la-editor/components/ui/icon"
import { motion } from "framer-motion"
import { useKeybind } from "@/lib/providers/keybind-provider" // Import the hook

const MODIFIER_KEYS = ["Control", "Alt", "Shift", "Meta"]

const HotkeyInput = ({
	label,
	value,
	onChange
}: {
	label: string
	value: string
	onChange: (value: string) => void
}) => {
	const [recording, setRecording] = useState(false)
	const [currentKeys, setCurrentKeys] = useState<string[]>([])
	const [isHovering, setIsHovering] = useState(false)
	const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	const stopRecording = useCallback(() => {
		setRecording(false)
		setCurrentKeys([])
	}, [])

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			e.preventDefault()
			if (!recording) return
			const key = e.key === " " ? "Space" : e.key
			if (!currentKeys.includes(key)) {
				setCurrentKeys(prev => {
					const newKeys = [...prev, key]
					return newKeys.slice(-3)
				})
			}
			// Clear the timeout on each keydown
			if (recordingTimeoutRef.current) {
				clearTimeout(recordingTimeoutRef.current)
			}
		},
		[recording, currentKeys]
	)

	const handleKeyUp = useCallback(
		(e: React.KeyboardEvent) => {
			if (!recording) return
			const key = e.key === " " ? "Space" : e.key
			if (MODIFIER_KEYS.includes(key)) return
			if (currentKeys.length > 0) {
				onChange(currentKeys.join("+"))
				// Set a timeout to stop recording if no key is pressed
				recordingTimeoutRef.current = setTimeout(stopRecording, 500)
			}
		},
		[recording, currentKeys, onChange, stopRecording]
	)

	const handleClearKeybind = () => {
		onChange("")
		setCurrentKeys([])
	}

	useEffect(() => {
		if (recording) {
			const handleKeyDownEvent = (e: KeyboardEvent) => handleKeyDown(e as unknown as React.KeyboardEvent)
			const handleKeyUpEvent = (e: KeyboardEvent) => handleKeyUp(e as unknown as React.KeyboardEvent)
			window.addEventListener("keydown", handleKeyDownEvent)
			window.addEventListener("keyup", handleKeyUpEvent)
			return () => {
				window.removeEventListener("keydown", handleKeyDownEvent)
				window.removeEventListener("keyup", handleKeyUpEvent)
				if (recordingTimeoutRef.current) {
					clearTimeout(recordingTimeoutRef.current)
				}
			}
		}
	}, [recording, handleKeyDown, handleKeyUp])

	return (
		<div className="mb-4 space-y-2">
			<label className="block text-sm font-medium">{label}</label>
			<div className="flex items-center space-x-2">
				<div
					className="relative w-full"
					onMouseEnter={() => setIsHovering(true)}
					onMouseLeave={() => setIsHovering(false)}
				>
					<Input
						type="text"
						value={recording ? currentKeys.join("+") : value}
						placeholder="Click to set hotkey"
						className="flex-grow active:border-none"
						readOnly
						onClick={() => setRecording(true)}
						onBlur={stopRecording}
					/>
					{isHovering && value && (
						<motion.div
							initial={{ opacity: 0, y: "-50%" }}
							animate={{ opacity: 1, y: "-50%" }}
							exit={{ opacity: 0, y: "-50%" }}
							transition={{ duration: 0.1 }}
							className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer rounded-sm bg-neutral-800 p-[6px] transition-all hover:scale-[1.05] active:scale-[0.95]"
							onClick={handleClearKeybind}
						>
							<Icon name="X" className="h-[16px] w-[16px]" />
						</motion.div>
					)}
				</div>
				<Button
					onClick={() => {
						if (recording) {
							stopRecording()
						} else {
							setRecording(true)
						}
					}}
					variant={recording ? "destructive" : "secondary"}
				>
					{recording ? "Cancel" : "Set"}
				</Button>
			</div>
		</div>
	)
}

export const SettingsRoute = () => {
	const [inboxHotkey, setInboxHotkey] = useState("")
	const [topInboxHotkey, setTopInboxHotkey] = useState("")
	const { addKeybind, removeKeybind } = useKeybind()
	const prevInboxHotkeyRef = useRef("")
	const prevTopInboxHotkeyRef = useRef("")

	const updateKeybind = useCallback(
		(prevKey: string, newKey: string, action: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
			if (prevKey) removeKeybind(prevKey)
			if (newKey) {
				const existingKeybind = [inboxHotkey, topInboxHotkey].find(hotkey => hotkey === newKey && hotkey !== prevKey)
				if (existingKeybind) {
					removeKeybind(existingKeybind)
					if (existingKeybind === inboxHotkey) {
						setInboxHotkey("")
						prevInboxHotkeyRef.current = ""
					} else {
						setTopInboxHotkey("")
						prevTopInboxHotkeyRef.current = ""
					}
					toast.info("Keybind conflict resolved", {
						description: `The keybind "${newKey}" was removed from its previous action.`
					})
				}
				addKeybind({ key: newKey, callback: () => console.log(`${action} action`) })
				setter(newKey) // Update the state with the new keybind
			}
		},
		[addKeybind, removeKeybind, inboxHotkey, topInboxHotkey]
	)

	const saveSettings = () => {
		updateKeybind(prevInboxHotkeyRef.current, inboxHotkey, "Save to Inbox", setInboxHotkey)
		updateKeybind(prevTopInboxHotkeyRef.current, topInboxHotkey, "Save to Inbox (Top)", setTopInboxHotkey)
		prevInboxHotkeyRef.current = inboxHotkey
		prevTopInboxHotkeyRef.current = topInboxHotkey
	}

	return (
		<div className="flex flex-1 flex-col">
			<header className="border-b border-neutral-200 dark:border-neutral-800">
				<h1 className="p-6 text-2xl font-semibold">Settings</h1>
			</header>
			<main className="flex-1 overflow-y-auto p-6">
				<section className="mb-8 max-w-md">
					<HotkeyInput label="Save to Inbox" value={inboxHotkey} onChange={setInboxHotkey} />
					<HotkeyInput label="Save to Inbox (Top)" value={topInboxHotkey} onChange={setTopInboxHotkey} />
				</section>
				<Button onClick={saveSettings}>Save Settings</Button>
			</main>
		</div>
	)
}
