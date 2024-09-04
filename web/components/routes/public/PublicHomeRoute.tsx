"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { Autocomplete } from "./Autocomplete"
import { useRouter } from "next/navigation"

let graph_data_promise = import("./graph-data.json").then(a => a.default)

const ForceGraphClient = dynamic(() => import("./force-graph-client-lazy"), { ssr: false })

interface GraphNode {
	name: string
	prettyName: string
	connectedTopics: string[]
}

export function PublicHomeRoute() {
	const router = useRouter()
	const raw_graph_data = React.use(graph_data_promise) as GraphNode[]
	const [filterQuery, setFilterQuery] = React.useState<string>("")

	const handleTopicSelect = (topic: GraphNode) => {
		router.push(`/${topic.name}`)
	}

	const handleInputChange = (value: string) => {
		setFilterQuery(value)
	}

	return (
		<div className="relative h-full w-screen">
			<ForceGraphClient
				raw_nodes={raw_graph_data}
				onNodeClick={val => {
					console.log("clicked", val)
				}}
				filter_query={filterQuery}
			/>

			<motion.div
				className="absolute left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform max-sm:px-5"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				style={{ x: "-50%", y: "-50%" }}
			>
				<motion.h1
					className="mb-2 text-center text-3xl font-bold uppercase sm:mb-4 md:text-5xl"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					I want to learn
				</motion.h1>
				<Autocomplete topics={raw_graph_data} onSelect={handleTopicSelect} onInputChange={handleInputChange} />
			</motion.div>
		</div>
	)
}

export default PublicHomeRoute
