"use client"

import React, { useRef } from "react"
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
	const { topic } = useTopicData(topicName, me)
	// const { activeIndex, setActiveIndex, containerRef, linkRefs } = useLinkNavigation(allLinks)
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
				me={me}
				personalLinks={me.root.personalLinks}
			/>
		</div>
	)
}
