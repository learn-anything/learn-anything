"use client"

import React from "react"
import { TopicDetailHeader } from "./Header"
import { TopicSections } from "./partials/topic-sections"
import { useLinkNavigation } from "./use-link-navigation"
import { useTopicData } from "@/hooks/use-topic-data"

interface TopicDetailRouteProps {
	topicName: string
}

export function TopicDetailRoute({ topicName }: TopicDetailRouteProps) {
	const { topic, allLinks } = useTopicData(topicName)
	const { activeIndex, setActiveIndex, containerRef, linkRefs } = useLinkNavigation(allLinks)

	if (!topic) {
		return null
	}

	return (
		<div className="flex h-full flex-auto flex-col">
			<TopicDetailHeader topic={topic} />
			<TopicSections
				sections={topic.latestGlobalGuide?.sections}
				activeIndex={activeIndex}
				setActiveIndex={setActiveIndex}
				linkRefs={linkRefs}
				containerRef={containerRef}
			/>
		</div>
	)
}
