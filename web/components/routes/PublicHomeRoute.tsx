"use client"
import * as react from "react"
import type * as force_graph from "./force-graph-client"
import { useCoState } from "@/lib/providers/jazz-provider"
import { PublicGlobalGroup } from "@/lib/schema/master/public-group"
import { ID } from "jazz-tools"
import dynamic from "next/dynamic"

let graph_data_promise = import("./graph-data.json").then(a => a.default)
// let ForceGraphClient = react.lazy(() => import("./force-graph-client-lazy"))
const ForceGraphClient = dynamic(() => import("./force-graph-client-lazy"), { ssr: false })

export function PublicHomeRoute() {
	let raw_graph_data = react.use(graph_data_promise)

	const [placeholder, setPlaceholder] = react.useState("Search something...")
	const [currentTopicIndex, setCurrentTopicIndex] = react.useState(0)
	const [currentCharIndex, setCurrentCharIndex] = react.useState(0)
	const globalGroup = useCoState(
		PublicGlobalGroup,
		process.env.NEXT_PUBLIC_JAZZ_GLOBAL_GROUP as ID<PublicGlobalGroup>,
		{
			root: {
				topics: []
			}
		}
	)
	const topics = globalGroup?.root.topics?.map(topic => topic?.prettyName) || []

	// let graph_items = react.useMemo(() => {
	// 	return raw_graph_data.map(
	// 		(item): force_graph.ConnectionItem => ({
	// 			key: item.name,
	// 			title: item.prettyName,
	// 			connections: item.connectedTopics
	// 		})
	// 	)
	// }, [raw_graph_data])

	react.useEffect(() => {
		if (topics.length === 0) return

		const typingInterval = setInterval(() => {
			const currentTopic = topics[currentTopicIndex]
			if (currentTopic && currentCharIndex < currentTopic.length) {
				setPlaceholder(`${currentTopic.slice(0, currentCharIndex + 1)}`)
				setCurrentCharIndex(currentCharIndex + 1)
			} else {
				clearInterval(typingInterval)
				setTimeout(() => {
					setCurrentTopicIndex(prevIndex => (prevIndex + 1) % topics.length)
					setCurrentCharIndex(0)
				}, 1000)
			}
		}, 200)

		return () => clearInterval(typingInterval)
	}, [currentTopicIndex, currentCharIndex, topics])

	return (
		<div className="relative h-full w-screen">
			<ForceGraphClient
				raw_nodes={raw_graph_data}
				onNodeClick={val => {
					console.log("clicked", val)
				}}
				filter_query=""
			/>
			<div className="absolute left-0 top-0 z-20 p-4">
				<h2 className="text-xl font-bold text-black dark:text-white">Learn Anything</h2>
			</div>
			<div className="absolute left-1/2 top-1/2 z-10 w-[60%] -translate-x-1/2 -translate-y-1/2 transform">
				<div className="flex flex-col items-center justify-center gap-6">
					<h1 className="text-center text-5xl font-bold uppercase text-black dark:text-white">i want to learn</h1>
					<input
						type="text"
						placeholder={placeholder}
						className="bg-result w-[70%] rounded-md border px-6 py-3 text-lg shadow-lg placeholder:text-black/40 focus:outline-none active:outline-none dark:placeholder:text-white/40"
					/>
				</div>
			</div>
		</div>
	)
}
