"use client"

import { LinkHeader } from "@/components/routes/link/header"
import { LinkList } from "@/components/routes/link/list"
import { LinkManage } from "@/components/routes/link/manage"
import { useQueryState } from "nuqs"
import { useEffect, useState } from "react"
import { useAtom } from "jotai"
import { linkEditIdAtom } from "@/store/link"
import { LinkBottomBar } from "./bottom-bar"

export function LinkRoute() {
	const [, setEditId] = useAtom(linkEditIdAtom)
	const [nuqsEditId] = useQueryState("editId")
	const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null)

	useEffect(() => {
		setEditId(nuqsEditId)
	}, [nuqsEditId, setEditId])

	return (
		<div className="flex h-full flex-auto flex-col overflow-hidden">
			<LinkHeader />
			<LinkManage />
			<LinkList key={nuqsEditId} activeItemIndex={activeItemIndex} setActiveItemIndex={setActiveItemIndex} />
			<LinkBottomBar />
		</div>
	)
}
