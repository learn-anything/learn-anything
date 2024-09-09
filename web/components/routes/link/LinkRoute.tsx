"use client"

import React, { useEffect, useState, useCallback } from "react"
import { LinkHeader } from "@/components/routes/link/header"
import { LinkList } from "@/components/routes/link/list"
import { LinkManage } from "@/components/routes/link/manage"
import { useQueryState } from "nuqs"
import { atom, useAtom } from "jotai"
import { linkEditIdAtom } from "@/store/link"
import { LinkBottomBar } from "./bottom-bar"
import { commandPaletteOpenAtom } from "@/components/custom/command-palette/command-palette"

export const isDeleteConfirmShownAtom = atom(false)

export function LinkRoute(): React.ReactElement {
	const [, setEditId] = useAtom(linkEditIdAtom)
	const [nuqsEditId] = useQueryState("editId")
	const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null)
	const [isCommandPaletteOpen] = useAtom(commandPaletteOpenAtom)
	const [isDeleteConfirmShown] = useAtom(isDeleteConfirmShownAtom)
	const [disableEnterKey, setDisableEnterKey] = useState(false)

	useEffect(() => {
		setEditId(nuqsEditId)
	}, [nuqsEditId, setEditId])

	const handleCommandPaletteClose = useCallback(() => {
		setDisableEnterKey(true)
		setTimeout(() => setDisableEnterKey(false), 100)
	}, [])

	useEffect(() => {
		if (!isCommandPaletteOpen) {
			handleCommandPaletteClose()
		}
	}, [isCommandPaletteOpen, handleCommandPaletteClose])

	useEffect(() => {
		setDisableEnterKey(isDeleteConfirmShown || isCommandPaletteOpen)
	}, [isDeleteConfirmShown, isCommandPaletteOpen])

	return (
		<div className="flex h-full flex-auto flex-col overflow-hidden">
			<LinkHeader />
			<LinkManage />
			<LinkList
				key={nuqsEditId}
				activeItemIndex={activeItemIndex}
				setActiveItemIndex={setActiveItemIndex}
				disableEnterKey={disableEnterKey}
			/>
			<LinkBottomBar />
		</div>
	)
}
