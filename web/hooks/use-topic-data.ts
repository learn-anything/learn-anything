import { useMemo } from "react"
import { useCoState } from "@/lib/providers/jazz-provider"
import { PublicGlobalGroup } from "@/lib/schema/master/public-group"
import { ID } from "jazz-tools"
import { Link } from "@/lib/schema"

const GLOBAL_GROUP_ID = process.env.NEXT_PUBLIC_JAZZ_GLOBAL_GROUP as ID<PublicGlobalGroup>

export function useTopicData(topicName: string) {
	const group = useCoState(PublicGlobalGroup, GLOBAL_GROUP_ID, {
		root: { topics: [] }
	})

	// const topic = useCoState(Topic, "co_zS3TH4Lkj5MK9GEehinxhjjNTxB" as ID<Topic>, {})
	const topic = useMemo(
		() => group?.root.topics.find(topic => topic?.name === topicName),
		[group?.root.topics, topicName]
	)

	const allLinks = useMemo(() => {
		if (!topic?.latestGlobalGuide?.sections) return []

		return topic.latestGlobalGuide.sections.flatMap(
			section => section?.links?.filter((link): link is Link => !!link?.url) ?? []
		)
	}, [topic?.latestGlobalGuide?.sections])

	return { topic, allLinks }
}
