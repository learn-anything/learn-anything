"use client"

import React, { useMemo, useState } from "react"
import { TopicDetailHeader } from "./Header"
import { useAccountOrGuest, useCoState } from "@/lib/providers/jazz-provider"
import { JAZZ_GLOBAL_GROUP_ID } from "@/lib/constants"
import { Topic } from "@/lib/schema"
import { TopicDetailList } from "./list"
import { atom } from "jotai"

interface TopicDetailRouteProps {
	topicName: string
}

export const openPopoverForIdAtom = atom<string | null>(null)

export function TopicDetailRoute({ topicName }: TopicDetailRouteProps) {
	const { me } = useAccountOrGuest({ root: { personalLinks: [] } })
	const topicID = useMemo(() => me && Topic.findUnique({ topicName }, JAZZ_GLOBAL_GROUP_ID, me), [topicName, me])
	const topic = useCoState(Topic, topicID, { latestGlobalGuide: { sections: [] } })

	const [activeIndex, setActiveIndex] = useState(-1)

	const flattenedItems = topic?.latestGlobalGuide?.sections.flatMap(section => [
		{ type: "section" as const, data: section },
		...(section?.links?.map(link => ({ type: "link" as const, data: link })) || [])
	])

	if (!topic || !me || !flattenedItems) {
		return null
	}

	return (
		<>
			<TopicDetailHeader topic={topic} />
			<TopicDetailList items={flattenedItems} topic={topic} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
		</>
	)
}
