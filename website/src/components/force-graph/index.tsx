import * as solid from "solid-js"
import { isServer } from "solid-js/web"
import { useGlobalState } from "../../GlobalContext/global.ts"

/**
 * Lazy-loaded force graph
 */
export function ForceGraph(props: {
  onNodeClick: (name: string) => void
}): solid.JSX.Element {
  const [client] = solid.createResource(!isServer, () => import("./client.ts"))
  const global = useGlobalState()

  return (
    <solid.Suspense>
      {(() => {
        const client_value = client()
        const raw_data = global.state.topicsWithConnections
        if (!client_value || raw_data.length === 0) return ""
        return client_value.createForceGraph(raw_data, props.onNodeClick)
      })()}
    </solid.Suspense>
  )
}
