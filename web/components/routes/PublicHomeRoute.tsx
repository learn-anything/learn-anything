import * as react from "react"

import type * as force_graph from "./force-graph-client"

let graph_data_promise = import("./graph-data.json").then(a => a.default)
let ForceGraphClient   = react.lazy(() => import("./force-graph-client"))

export default function PublicHomeRoute() {

	let raw_graph_data = react.use(graph_data_promise)
	
	return (
		<>
			<h1>I want to learn</h1>
			<ForceGraphClient raw_nodes={raw_graph_data} filter_query="" onNodeClick={() => {}}/>
		</>
	)
}
