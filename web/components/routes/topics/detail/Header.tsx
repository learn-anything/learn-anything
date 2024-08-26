"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ContentHeader, SidebarToggleButton } from "@/components/custom/content-header"
import { Topic } from "@/lib/schema"

interface TopicDetailHeaderProps {
	topic: Topic
}

export const TopicDetailHeader = React.memo(function TopicDetailHeader({ topic }: TopicDetailHeaderProps) {
	return (
		<>
			<ContentHeader className="px-6 py-5 max-lg:px-4">
				<div className="flex min-w-0 shrink-0 items-center gap-1.5">
					<SidebarToggleButton />
					<div className="flex min-h-0 items-center">
						<span className="truncate text-left text-xl font-bold">{topic.prettyName}</span>
					</div>
				</div>

				<div className="flex flex-auto"></div>

				<Button variant="secondary" size="sm" className="gap-x-2 text-sm">
					<span>Add to my profile</span>
				</Button>
			</ContentHeader>
		</>
	)
})

TopicDetailHeader.displayName = "TopicDetailHeader"
