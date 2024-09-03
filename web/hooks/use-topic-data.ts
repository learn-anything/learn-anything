import { useMemo } from "react"
import { useCoState } from "@/lib/providers/jazz-provider"
import { PublicGlobalGroup } from "@/lib/schema/master/public-group"
import { ID } from "jazz-tools"
import { LaAccount, Link, Topic } from "@/lib/schema"

const GLOBAL_GROUP_ID = process.env.NEXT_PUBLIC_JAZZ_GLOBAL_GROUP as ID<PublicGlobalGroup>

export function useTopicData(topicName: string, me?: LaAccount) {
	const findTopic = useMemo(() => me && Topic.findUnique({ topicName }, GLOBAL_GROUP_ID, me), [me])
	const topic = useCoState(Topic, findTopic, { latestGlobalGuide: { sections: [{ links: [{}] }] } })

	const transformedData = useMemo(() => {
		if (!topic?.latestGlobalGuide?.sections) return []

		return topic.latestGlobalGuide.sections.flatMap(section => [
			{ type: "section", data: section },
			...(section?.links?.filter(link => !!link?.url).map(link => ({ type: "link", data: link })) || [])
		])
	}, [topic?.latestGlobalGuide?.sections])

	const allLinks = useMemo(() => {
		if (!topic?.latestGlobalGuide?.sections) return []

		return topic.latestGlobalGuide.sections.flatMap(
			section => section?.links?.filter((link): link is Link => !!link?.url) ?? []
		)
	}, [topic?.latestGlobalGuide?.sections])

	return { topic, allLinks, transformedData }
}
