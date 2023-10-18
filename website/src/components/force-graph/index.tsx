import * as solid from "solid-js"
import { isServer } from "solid-js/web"

/**
 * Lazy-loaded force graph
 */
export function ForceGraph(props: {
  onNodeClick: (name: string) => void
}): solid.JSX.Element {
  const [client] = solid.createResource(!isServer, () => import("./client.ts"))
  const [rawData] = solid.createResource(!isServer, () =>
    import("./connections.json").then((m) => m.default)
  )

  return (
    <solid.Suspense>
      {(() => {
        const client_value = client()
        const raw_data = rawData()
        if (!client_value || !raw_data) return ""
        return client_value.createForceGraph(raw_data, props.onNodeClick)
      })()}
    </solid.Suspense>
  )
}
