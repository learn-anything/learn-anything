"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type Keybind = {
	key: string // Now this can be a combination like "Enter+z"
	callback: () => void
}

type KeybindContextType = {
	addKeybind: (keybind: Keybind) => void
	removeKeybind: (key: string) => void
}

const KeybindContext = createContext<KeybindContextType | undefined>(undefined)

export const KeybindProvider = ({ children }: { children: React.ReactNode }) => {
	const [keybinds, setKeybinds] = useState<Keybind[]>([])
	const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())

	const addKeybind = (keybind: Keybind) => {
		setKeybinds(prev => [...prev, keybind])
	}

	const removeKeybind = (key: string) => {
		setKeybinds(prev => prev.filter(kb => kb.key !== key))
	}

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			setPressedKeys(prev => new Set(prev).add(event.key))

			const currentKeys = Array.from(pressedKeys).concat(event.key).sort().join("+")
			const keybind = keybinds.find(kb => {
				const sortedKeybindKeys = kb.key.split("+").sort().join("+")
				return sortedKeybindKeys === currentKeys
			})

			if (keybind) {
				event.preventDefault()
				keybind.callback()
			}
		}

		const handleKeyUp = (event: KeyboardEvent) => {
			setPressedKeys(prev => {
				const next = new Set(prev)
				next.delete(event.key)
				return next
			})
		}

		window.addEventListener("keydown", handleKeyDown)
		window.addEventListener("keyup", handleKeyUp)
		return () => {
			window.removeEventListener("keydown", handleKeyDown)
			window.removeEventListener("keyup", handleKeyUp)
		}
	}, [keybinds, pressedKeys])

	return <KeybindContext.Provider value={{ addKeybind, removeKeybind }}>{children}</KeybindContext.Provider>
}

export const useKeybind = () => {
	const context = useContext(KeybindContext)
	if (context === undefined) {
		throw new Error("useKeybind must be used within a KeybindProvider")
	}
	return context
}
