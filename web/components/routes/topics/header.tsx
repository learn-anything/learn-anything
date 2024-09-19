"use client"

import * as React from "react"
import { ContentHeader, SidebarToggleButton } from "@/components/custom/content-header"
import { useAccount } from "@/lib/providers/jazz-provider"

interface TopicHeaderProps {}

export const TopicHeader: React.FC<TopicHeaderProps> = React.memo(() => {
	const { me } = useAccount()

	if (!me) return null

	return (
		<ContentHeader className="px-6 py-4 max-lg:px-4">
			<HeaderTitle />
			<div className="flex flex-auto" />
		</ContentHeader>
	)
})

TopicHeader.displayName = "TopicHeader"

const HeaderTitle: React.FC = () => (
	<div className="flex min-w-0 shrink-0 items-center gap-1.5">
		<SidebarToggleButton />
		<div className="flex min-h-0 items-center">
			<span className="truncate text-left font-bold lg:text-xl">Topics</span>
		</div>
	</div>
)
