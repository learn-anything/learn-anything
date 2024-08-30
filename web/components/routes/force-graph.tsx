"use client"
import { useCoState } from "@/lib/providers/jazz-provider"
import { PublicGlobalGroup } from "@/lib/schema/global-topic-graph"
import { glob } from "fs"
import { ID } from "jazz-tools"
import { useMemo } from "react"

export default function ForceGraph() {
	const globalGroup = useCoState(PublicGlobalGroup, "co_z6Tmg1sZTfwkPd4pV6qBV9T5SFU" as ID<PublicGlobalGroup>, {
		root: { topicGraph: [{ connectedTopics: [{}] }] }
	})

	const graph = useMemo(() => {
		return globalGroup?.root.topicGraph?.map(
			(topic: { name: string; prettyName: string; connectedTopics: Array<{ name?: string }> }) =>
				({
					name: topic.name,
					prettyName: topic.prettyName,
					connectedTopics: topic.connectedTopics.map(connected => connected?.name)
				}) || []
		)
	}, [globalGroup?.root.topicGraph])
	// const [{}]
	console.log(globalGroup, "graph")
	return <>{JSON.stringify(graph)}</>
}
