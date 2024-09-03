"use client"

import React, { useMemo } from "react"
import { TopicDetailHeader } from "./Header"
import { TopicSections } from "./partials/topic-sections"
import { useLinkNavigation } from "./use-link-navigation"
import { useTopicData } from "@/hooks/use-topic-data"
import { atom } from "jotai"
import { useAccount, useCoState } from "@/lib/providers/jazz-provider"
import { Link, Topic } from "@/lib/schema"
import { PublicGlobalGroup } from "@/lib/schema/master/public-group"
import { ID } from "jazz-tools"
import { LinkItem } from "./partials/link-item"

interface TopicDetailRouteProps {
	topicName: string
}

export const openPopoverForIdAtom = atom<string | null>(null)
const GLOBAL_GROUP_ID = process.env.NEXT_PUBLIC_JAZZ_GLOBAL_GROUP as ID<PublicGlobalGroup>

export function TopicDetailRoute({ topicName }: TopicDetailRouteProps) {
	const { me } = useAccount({ root: { personalLinks: [] } })

	// const { topic, allLinks, transformedData } = useTopicData(topicName, me)

	// const findTopic = useMemo(() => me && Topic.findUnique({ topicName }, GLOBAL_GROUP_ID, me), [me])
	// const topic = useCoState(Topic, findTopic, { latestGlobalGuide: { sections: [{ links: [] }] } })
	const topic = useCoState(Topic, "co_z729EvE8fQEgMGNGaR4HKa1Jfir" as ID<Topic>, {})

	const transformedData = useMemo(() => {
		if (!topic?.latestGlobalGuide?.sections) return []

		return topic.latestGlobalGuide.sections.flatMap(section => [
			{ type: "section", data: section },
			...(section?.links?.filter(link => !!link?.url).map(link => ({ type: "link", data: link })) || [])
		])
	}, [topic?.latestGlobalGuide?.sections])

	// console.log({ transformedData}, "transformedData")

	// const allLinks = useMemo(() => {
	// 	if (!topic?.latestGlobalGuide?.sections) return []

	// 	return topic.latestGlobalGuide.sections.flatMap(
	// 		section => section?.links?.filter((link): link is Link => !!link?.url) ?? []
	// 	)
	// }, [topic?.latestGlobalGuide?.sections])

	// const { activeIndex, setActiveIndex, containerRef, linkRefs } = useLinkNavigation(allLinks)

	if (!topic || !me) {
		return null
	}

	return (
		<div className="flex h-full flex-auto flex-col">
			<TopicDetailHeader topic={topic} />
			{/* <TopicSections
				topic={topic}
				sections={topic.latestGlobalGuide?.sections}
				activeIndex={activeIndex}
				setActiveIndex={setActiveIndex}
				linkRefs={linkRefs}
				containerRef={containerRef}
				me={me}
				personalLinks={me.root.personalLinks}
			/> */}

			<div className="flex w-full flex-1 flex-col overflow-y-auto [scrollbar-gutter:stable]">
				<div tabIndex={-1} className="outline-none">
					<div className="flex flex-1 flex-col gap-4" role="listbox" aria-label="Topic sections">
						{transformedData?.map((data, index) =>
							data.type === "section" ? (
								<Section
									key={index}
									section={data.data}
									// key={sectionIndex}
									// topic={topic}
									// section={section}
									// activeIndex={activeIndex}
									// setActiveIndex={setActiveIndex}
									// startIndex={sections.slice(0, sectionIndex).reduce((acc, s) => acc + (s?.links?.length || 0), 0)}
									// linkRefs={linkRefs}
									// me={me}
									// personalLinks={personalLinks}
								/>
							) : (
								<LinkItem
									key={index}
									link={data.data}
									// topic={topic}
									// isActive={activeIndex === startIndex + index}
									// index={startIndex + index}
									// setActiveIndex={setActiveIndex}
									// ref={el => {
									// 	linkRefs.current[startIndex + index] = el
									// }}
									// me={me}
									// personalLinks={personalLinks}
								/>
							)
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
