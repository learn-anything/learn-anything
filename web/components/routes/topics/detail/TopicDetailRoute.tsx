"use client"

import React, { useMemo, useState } from "react"
import { TopicDetailHeader } from "./header"
import { useAccountOrGuest, useCoState } from "@/lib/providers/jazz-provider"
import { JAZZ_GLOBAL_GROUP_ID } from "@/lib/constants"
import { Topic } from "@/lib/schema"
import { TopicDetailList } from "./list"
import { atom } from "jotai"
import { Skeleton } from "@/components/ui/skeleton"
import { GraphNode } from "../../public/PublicHomeRoute"
import { LaIcon } from "@/components/custom/la-icon"

const graph_data_promise = import("@/components/routes/public/graph-data.json").then(a => a.default)
interface TopicDetailRouteProps {
	topicName: string
}

export const openPopoverForIdAtom = atom<string | null>(null)

export function TopicDetailRoute({ topicName }: TopicDetailRouteProps) {
	const raw_graph_data = React.use(graph_data_promise) as GraphNode[]

	const { me } = useAccountOrGuest({ root: { personalLinks: [] } })

	const topicID = useMemo(() => me && Topic.findUnique({ topicName }, JAZZ_GLOBAL_GROUP_ID, me), [topicName, me])
	const topic = useCoState(Topic, topicID, { latestGlobalGuide: { sections: [] } })
	const [activeIndex, setActiveIndex] = useState(-1)

	const topicExists = raw_graph_data.find(node => node.name === topicName)

	if (!topicExists) {
		return <NotFoundPlaceholder />
	}

	const flattenedItems = topic?.latestGlobalGuide?.sections.flatMap(section => [
		{ type: "section" as const, data: section },
		...(section?.links?.map(link => ({ type: "link" as const, data: link })) || [])
	])

	if (!topic || !me || !flattenedItems) {
		return <TopicDetailSkeleton />
	}

	return (
		<>
			<TopicDetailHeader topic={topic} />
			<TopicDetailList items={flattenedItems} topic={topic} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
		</>
	)
}

function NotFoundPlaceholder() {
	return (
		<div className="flex h-full grow flex-col items-center justify-center gap-3">
			<div className="flex flex-row items-center gap-1.5">
				<LaIcon name="CircleAlert" />
				<span className="text-left font-medium">Topic not found</span>
			</div>
			<span className="max-w-sm text-left text-sm">There is no topic with the given identifier.</span>
		</div>
	)
}

function TopicDetailSkeleton() {
	return (
		<>
			<div className="flex items-center justify-between px-6 py-5 max-lg:px-4">
				<div className="flex items-center space-x-4">
					<Skeleton className="h-8 w-8 rounded-full" />
					<Skeleton className="h-6 w-48" />
				</div>
				<Skeleton className="h-9 w-36" />
			</div>

			<div className="space-y-4 p-6 max-lg:px-4">
				{[...Array(10)].map((_, index) => (
					<div key={index} className="flex items-center space-x-4">
						<Skeleton className="h-7 w-7 rounded-full" />
						<div className="flex-1 space-y-2">
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="h-3 w-1/2" />
						</div>
					</div>
				))}
			</div>
		</>
	)
}
