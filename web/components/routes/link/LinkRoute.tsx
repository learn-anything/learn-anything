"use client"

import React, { useState } from "react"
import { LinkHeader } from "@/components/routes/link/header"
import { LinkList } from "@/components/routes/link/list"
import { LinkManage } from "@/components/routes/link/manage"
import { useQueryState } from "nuqs"
import { atom } from "jotai"
import { LinkBottomBar } from "./bottom-bar"
import { useKey } from "react-use"

export const isDeleteConfirmShownAtom = atom(false)

export function LinkRoute(): React.ReactElement {
	const [nuqsEditId, setNuqsEditId] = useQueryState("editId")
	const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null)
	const [keyboardActiveIndex, setKeyboardActiveIndex] = useState<number | null>(null)

	useKey("Escape", () => {
		setNuqsEditId(null)
	})

	return (
		<>
			<LinkHeader />
			<LinkManage />
			<LinkList
				key={nuqsEditId}
				activeItemIndex={activeItemIndex}
				setActiveItemIndex={setActiveItemIndex}
				keyboardActiveIndex={keyboardActiveIndex}
				setKeyboardActiveIndex={setKeyboardActiveIndex}
			/>
			<LinkBottomBar />
		</>
	)
}
