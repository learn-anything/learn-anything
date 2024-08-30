"use client"

import * as react from "react"

import type * as force_graph from "./force-graph-client"

let graph_data_promise = import("./graph-data.json").then(a => a.default)
let ForceGraphClient = react.lazy(() => import("./force-graph-client-lazy"))

export function PublicHomeRoute() {
	let raw_graph_data = react.use(graph_data_promise)

	let graph_items = react.useMemo(() => {
		return raw_graph_data.map(
			(item): force_graph.ConnectionItem => ({
				key: item.name,
				title: item.prettyName,
				connections: item.connectedTopics
			})
		)
	}, [raw_graph_data])

	return (
		<ForceGraphClient
			raw_nodes={raw_graph_data}
			onNodeClick={val => {
				console.log("clicked", val)
			}}
			filter_query=""
		/>
	)
}
