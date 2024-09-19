"use client"

import { useCallback, useEffect, useState } from "react"
import { TopicHeader } from "./header"
import { TopicList } from "./list"
import { useAtom } from "jotai"
import { commandPaletteOpenAtom } from "@/components/custom/command-palette/command-palette"

export function TopicRoute() {
	const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null)
	const [isCommandPaletteOpen] = useAtom(commandPaletteOpenAtom)
	const [disableEnterKey, setDisableEnterKey] = useState(false)

	const handleCommandPaletteClose = useCallback(() => {
		setDisableEnterKey(true)
		setTimeout(() => setDisableEnterKey(false), 100)
	}, [])

	useEffect(() => {
		if (!isCommandPaletteOpen) {
			handleCommandPaletteClose()
		}
	}, [isCommandPaletteOpen, handleCommandPaletteClose])

	return (
		<div className="flex h-full flex-auto flex-col overflow-hidden">
			<TopicHeader />
			<TopicList
				activeItemIndex={activeItemIndex}
				setActiveItemIndex={setActiveItemIndex}
				disableEnterKey={disableEnterKey}
			/>
		</div>
	)
}
