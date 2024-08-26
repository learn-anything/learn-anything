"use client"

import { LinkHeader } from "@/components/routes/link/header"
import { LinkList } from "@/components/routes/link/list"
import { LinkManage } from "@/components/routes/link/form/manage"
import { useAtom } from "jotai"
import { linkEditIdAtom } from "@/store/link"

export default function AuthHomeRoute() {
	const [editId] = useAtom(linkEditIdAtom)

	return (
		<div className="relative z-[1] flex h-full flex-auto flex-col overflow-hidden">
			<LinkHeader />
			<LinkManage />
			<LinkList key={editId} />
		</div>
	)
}
