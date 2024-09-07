"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { Autocomplete } from "./Autocomplete"
import { useRouter } from "next/navigation"
import { useAccount } from "@/lib/providers/jazz-provider"
import TextBlurTransition from "@/components/custom/text-blur-transition"

let graph_data_promise = import("./graph-data.json").then(a => a.default)

const ForceGraphClient = dynamic(() => import("./force-graph-client-lazy"), { ssr: false })

export interface GraphNode {
	name: string
	prettyName: string
	connectedTopics: string[]
}

export function PublicHomeRoute() {
	const router = useRouter()
	const raw_graph_data = React.use(graph_data_promise) as GraphNode[]
	const [filterQuery, setFilterQuery] = React.useState<string>("")
	const { me } = useAccount()

	const handleTopicSelect = (topicName: string) => {
		router.push(`/${topicName}`)
	}

	const handleInputChange = (value: string) => {
		setFilterQuery(value)
	}

	return (
		<>
			<div className="relative h-full w-screen overflow-hidden">
				<ForceGraphClient
					raw_nodes={raw_graph_data}
					onNodeClick={val => handleTopicSelect(val)}
					filter_query={filterQuery}
				/>

				<motion.div
					className="absolute left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform max-sm:px-5"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					style={{ x: "-50%", y: "-50%" }}
				>
					<div
						className="absolute left-1/2 top-1/2 h-[350px] w-[500px] -translate-x-1/2 -translate-y-1/2 transform md:h-[450px] md:w-[700px]"
						style={{
							background:
								"radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.5) 40%, rgba(0, 0, 0, 0) 70%)",
							backgroundSize: "100% 100%",
							backgroundPosition: "center",
							backgroundRepeat: "no-repeat"
						}}
					></div>
					<TextBlurTransition className="mb-1 text-center text-3xl font-bold uppercase sm:mb-4 md:text-5xl">
						I want to learn
					</TextBlurTransition>
					<Autocomplete
						topics={raw_graph_data}
						onSelect={topic => handleTopicSelect(topic.name)}
						onInputChange={handleInputChange}
					/>
				</motion.div>
			</div>
		</>
	)
}

export default PublicHomeRoute
