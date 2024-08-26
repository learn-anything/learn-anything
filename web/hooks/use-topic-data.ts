import { useMemo } from "react"
import { useCoState } from "@/lib/providers/jazz-provider"
import { PublicGlobalGroup } from "@/lib/schema/master/public-group"
import { ID } from "jazz-tools"

export function useTopicData(topicName: string) {
	const topics = useCoState(PublicGlobalGroup, process.env.NEXT_PUBLIC_JAZZ_GLOBAL_GROUP as ID<PublicGlobalGroup>, {
		root: { topics: [] }
	})

	const topic = topics?.root.topics.find(topic => topic?.name === topicName)

	const allLinks = useMemo(() => {
		if (topic?.latestGlobalGuide?.sections) {
			return topic.latestGlobalGuide.sections.flatMap(section => section?.links || []).filter(link => link?.url)
		}
		return []
	}, [topic])

	return { topic, allLinks }
}
