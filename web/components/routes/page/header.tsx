"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ContentHeader, SidebarToggleButton } from "@/components/custom/content-header"
import { LaIcon } from "@/components/custom/la-icon"

export const PageHeader = React.memo(() => {
	return (
		<ContentHeader className="px-6 py-5 max-lg:px-4">
			<div className="flex min-w-0 shrink-0 items-center gap-1.5">
				<SidebarToggleButton />
				<div className="flex min-h-0 items-center">
					<span className="truncate text-left font-bold lg:text-xl">Pages</span>
				</div>
			</div>

			<div className="flex flex-auto"></div>

			<div className="flex w-auto items-center justify-end">
				<div className="flex items-center gap-2">
					<Button size="sm" type="button" variant="secondary" className="gap-x-2">
						<LaIcon name="Plus" />
						<span className="hidden md:block">New page</span>
					</Button>
				</div>
			</div>
		</ContentHeader>
	)
})

PageHeader.displayName = "PageHeader"
