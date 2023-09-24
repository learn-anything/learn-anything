import * as solid from "solid-js"
import { isServer } from "solid-js/web"

/**
 * Lazy-loaded force graph
 */
export function ForceGraph(): solid.JSX.Element {
  const [client] = solid.createResource(!isServer, () => import("./client.ts"))
  return (
    <solid.Suspense>
      {(() => {
        const client_value = client()
        return client_value ? client_value.createForceGraph() : ""
      })()}
    </solid.Suspense>
  )
}
