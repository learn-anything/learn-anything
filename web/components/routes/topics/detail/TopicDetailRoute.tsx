"use client"

import React from "react"
import { TopicDetailHeader } from "./Header"
import { TopicSections } from "./partials/topic-sections"
import { useLinkNavigation } from "./use-link-navigation"
import { useTopicData } from "@/hooks/use-topic-data"
import { atom } from "jotai"
import { useAccount } from "@/lib/providers/jazz-provider"

interface TopicDetailRouteProps {
	topicName: string
}

export const openPopoverForIdAtom = atom<string | null>(null)

export function TopicDetailRoute({ topicName }: TopicDetailRouteProps) {
	const { me } = useAccount({ root: { personalLinks: [] } })
	const { topic, allLinks } = useTopicData(topicName)
	const { activeIndex, setActiveIndex, containerRef, linkRefs } = useLinkNavigation(allLinks)

	if (!topic || !me) {
		return null
	}

	return (
		<div className="flex h-full flex-auto flex-col">
			<TopicDetailHeader topic={topic} />
			<TopicSections
				topic={topic}
				sections={topic.latestGlobalGuide?.sections}
				activeIndex={activeIndex}
				setActiveIndex={setActiveIndex}
				linkRefs={linkRefs}
				containerRef={containerRef}
				me={me}
				personalLinks={me.root.personalLinks}
			/>
		</div>
	)
}
