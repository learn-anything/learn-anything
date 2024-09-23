"use client"

import * as React from "react"
import { LinkHeader } from "@/components/routes/link/header"
import { LinkList } from "@/components/routes/link/list"
import { LinkManage } from "@/components/routes/link/manage"
import { atom } from "jotai"
import { LinkBottomBar } from "./bottom-bar"

export const isDeleteConfirmShownAtom = atom(false)

export function LinkRoute(): React.ReactElement {
	return (
		<>
			<LinkHeader />
			<LinkManage />
			<LinkList />
			<LinkBottomBar />
		</>
	)
}
