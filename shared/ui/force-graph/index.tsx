import * as solid from "solid-js"
import { isServer } from "solid-js/web"
import type * as client from "./client.jsx"

/**
 * Lazy-loaded force graph
 */
export function ForceGraph(props: client.ForceGraphProps): solid.JSX.Element {
  const [clientModule] = solid.createResource(
    !isServer,
    () => import("./client.jsx")
  )

  return (
    <solid.Suspense>
      {(() => {
        const client_module = clientModule()
        if (!client_module) return ""
        return client_module.createForceGraph(props)
      })()}
    </solid.Suspense>
  )
}
