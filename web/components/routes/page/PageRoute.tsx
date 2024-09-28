"use client"

import { PageHeader } from "./header"
import { PageList } from "./list"

export function PageRoute() {
	return (
		<div className="flex h-full flex-auto flex-col overflow-hidden">
			<PageHeader />
			<PageList />
		</div>
	)
}
