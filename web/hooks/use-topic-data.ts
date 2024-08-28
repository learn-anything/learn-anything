import { useMemo } from "react"
import { useCoState } from "@/lib/providers/jazz-provider"
import { PublicGlobalGroup } from "@/lib/schema/master/public-group"
import { ID } from "jazz-tools"
// import { Topic } from "@/lib/schema"

export function useTopicData(topicName: string) {
	const group = useCoState(PublicGlobalGroup, process.env.NEXT_PUBLIC_JAZZ_GLOBAL_GROUP as ID<PublicGlobalGroup>, {
		root: { topics: [] }
	})

	// const topic = useCoState(Topic, "co_zS3TH4Lkj5MK9GEehinxhjjNTxB" as ID<Topic>, {})
	const topic = group?.root.topics.find(topic => topic?.name === topicName)
	console.log(topic?.id)

	const allLinks = useMemo(() => {
		if (topic?.latestGlobalGuide?.sections) {
			return topic.latestGlobalGuide.sections.flatMap(section => section?.links || []).filter(link => link?.url)
		}
		return []
	}, [topic])

	return { topic, allLinks }
}
