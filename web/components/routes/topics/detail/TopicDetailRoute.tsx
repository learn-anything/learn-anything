"use client"

import React, { useMemo, useRef } from "react"
import { TopicDetailHeader } from "./Header"
import { TopicSections } from "./partials/topic-sections"
import { atom } from "jotai"
import { useAccount, useCoState } from "@/lib/providers/jazz-provider"
import { Topic } from "@/lib/schema"
import { JAZZ_GLOBAL_GROUP_ID } from "@/lib/constants"

interface TopicDetailRouteProps {
	topicName: string
}

export const openPopoverForIdAtom = atom<string | null>(null)

export function TopicDetailRoute({ topicName }: TopicDetailRouteProps) {
	const { me } = useAccount({ root: { personalLinks: [] } })

	const topicID = useMemo(() => me && Topic.findUnique({ topicName }, JAZZ_GLOBAL_GROUP_ID, me), [topicName, me])
	const topic = useCoState(Topic, topicID, { latestGlobalGuide: { sections: [{ links: [] }] } })
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
