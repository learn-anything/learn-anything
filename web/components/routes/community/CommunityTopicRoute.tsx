"use client"

import React from "react"
import { useTopicData } from "@/hooks/use-topic-data"
import { useAccountOrGuest } from "@/lib/providers/jazz-provider"
import { ContentHeader, SidebarToggleButton } from "@/components/custom/content-header"
import { GuideCommunityToggle } from "@/components/custom/GuideCommunityToggle"

interface CommunityTopicRouteProps {
	topicName: string
}

export function CommunityTopicRoute({ topicName }: CommunityTopicRouteProps) {
	const { me } = useAccountOrGuest({ root: { personalLinks: [] } })
	const { topic } = useTopicData(topicName, me)

	if (!topic) {
		return null
	}

	return (
		<div className="flex h-full flex-auto flex-col">
			<ContentHeader className="px-6 py-5 max-lg:px-4">
				<div className="flex min-w-0 shrink-0 items-center gap-1.5">
					<SidebarToggleButton />
					<div className="flex min-h-0 flex-col items-start">
						<p className="opacity-40">Topic</p>
						<span className="truncate text-left font-bold lg:text-xl">{topic.prettyName}</span>
					</div>
				</div>
				<div className="flex-grow" />
				<GuideCommunityToggle topicName={topic.name} />
			</ContentHeader>
			<div className="flex-1 overflow-y-auto p-6">
				<p>Community content for {topic.prettyName} will be displayed here.</p>
			</div>
		</div>
	)
}
