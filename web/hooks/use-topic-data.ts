import { useMemo } from "react"
import { useCoState } from "@/lib/providers/jazz-provider"
import { PublicGlobalGroup } from "@/lib/schema/master/public-group"
import { Account, ID } from "jazz-tools"
import { Link, Topic } from "@/lib/schema"

const GLOBAL_GROUP_ID = process.env.NEXT_PUBLIC_JAZZ_GLOBAL_GROUP as ID<PublicGlobalGroup>

export function useTopicData(topicName: string, me: Account | undefined) {
	const topicID = useMemo(() => me && Topic.findUnique({topicName}, GLOBAL_GROUP_ID, me), [topicName, me])

	const topic = useCoState(Topic, topicID, {latestGlobalGuide: {sections: [{links: []}]}})

	return { topic }
}
