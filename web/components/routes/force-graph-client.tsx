"use client"

import * as react from "react"

let graph_data_promise = import("./graph-data.json").then(a => a.default)
let ForceGraphClient   = react.lazy(() => import("./force-graph-client-lazy"))

export default function ForceGraph() {
	let raw_graph_data = react.use(graph_data_promise)

	return <ForceGraphClient raw_nodes={raw_graph_data} filter_query="" onNodeClick={() => {}}/>
}
