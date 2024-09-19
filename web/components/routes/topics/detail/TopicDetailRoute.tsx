"use client"

import React, { useRef } from "react"
import { TopicDetailHeader } from "./Header"
import { TopicSections } from "./partials/topic-sections"
import { atom } from "jotai"
import { useAccountOrGuest } from "@/lib/providers/jazz-provider"
import { useTopicData } from "@/hooks/use-topic-data"

interface TopicDetailRouteProps {
	topicName: string
}

export const openPopoverForIdAtom = atom<string | null>(null)

export function TopicDetailRoute({ topicName }: TopicDetailRouteProps) {
	const { me } = useAccountOrGuest({ root: { personalLinks: [] } })
	const { topic } = useTopicData(topicName, me)
	const linksRefDummy = useRef<(HTMLLIElement | null)[]>([])
	const containerRefDummy = useRef<HTMLDivElement>(null)

	if (!topic || !me) {
		return null
	}

	return (
		<div className="flex h-full flex-auto flex-col">
			<TopicDetailHeader topic={topic} />
			<TopicSections
				topic={topic}
				sections={topic.latestGlobalGuide?.sections}
				activeIndex={0}
				setActiveIndex={() => {}}
				linkRefs={linksRefDummy}
				containerRef={containerRefDummy}
			/>
		</div>
	)
}
