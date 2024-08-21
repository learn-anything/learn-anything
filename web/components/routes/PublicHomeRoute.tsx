"use client"

import * as react from "react"

import type * as force_graph from "./ForceGraphClient"

let graph_data_promise = import("./graph_data.json").then(a => a.default)
let ForceGraphClient   = react.lazy(() => import("./ForceGraphClient"))

export default function PublicHomeRoute() {

	let raw_graph_data = react.use(graph_data_promise)

	let graph_items = react.useMemo(() => {
		return raw_graph_data.map((item): force_graph.ConnectionItem => ({
			key:         item.name,
			title:       item.prettyName,
			connections: item.connectedTopics,	
		}))
	}, [raw_graph_data])
	
	return (
		<>
			<h1>I want to learn</h1>
			<ForceGraphClient items={graph_items}/>
		</>
	)
}
