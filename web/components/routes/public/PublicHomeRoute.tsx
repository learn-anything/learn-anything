"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { Autocomplete } from "./Autocomplete"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { raleway } from "@/app/fonts"

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

	const handleTopicSelect = (topic: string) => {
		router.replace(`/${topic}`)
	}

	const handleInputChange = (value: string) => {
		setFilterQuery(value)
	}

	return (
		<div className="relative h-full w-screen">
			<ForceGraphClient raw_nodes={raw_graph_data} onNodeClick={handleTopicSelect} filter_query={filterQuery} />

			<div className="absolute left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 transform max-sm:px-5">
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
					<motion.h1
						className={cn("mb-2 text-center text-5xl font-bold tracking-tight sm:mb-4 md:text-7xl", raleway.className)}
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						I want to learn
					</motion.h1>
					<Autocomplete topics={raw_graph_data} onSelect={handleTopicSelect} onInputChange={handleInputChange} />
				</motion.div>
			</div>
		</div>
	)
}

export default PublicHomeRoute
