"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { Autocomplete } from "./Autocomplete"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { raleway } from "@/app/fonts"
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
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5, duration: 1 }}
						className="absolute left-1/2 top-1/2 h-[350px] w-[500px] -translate-x-1/2 -translate-y-1/2 transform md:h-[450px] md:w-[700px]"
						style={{
							background:
								"radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.5) 40%, rgba(0, 0, 0, 0) 70%)",
							backgroundSize: "100% 100%",
							backgroundPosition: "center",
							backgroundRepeat: "no-repeat",
							zIndex: 0
						}}
					></motion.div>
					<TextBlurTransition
						className={cn("mb-2 text-center text-5xl font-bold tracking-tight sm:mb-4 md:text-7xl", raleway.className)}
					>
						I want to learn
					</TextBlurTransition>
					<Autocomplete topics={raw_graph_data} onSelect={handleTopicSelect} onInputChange={handleInputChange} />
				</motion.div>
			</div>
		</div>
	)
}

export default PublicHomeRoute
