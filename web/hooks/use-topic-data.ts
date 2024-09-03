import { useMemo } from "react"
import { useCoState } from "@/lib/providers/jazz-provider"
import { Account } from "jazz-tools"
import { Topic } from "@/lib/schema"
import { JAZZ_GLOBAL_GROUP_ID } from "@/lib/constants"

export function useTopicData(topicName: string, me: Account | undefined) {
	const topicID = useMemo(() => me && Topic.findUnique({ topicName }, JAZZ_GLOBAL_GROUP_ID, me), [topicName, me])

	const topic = useCoState(Topic, topicID, { latestGlobalGuide: { sections: [{ links: [] }] } })

	return { topic }
}
