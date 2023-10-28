import * as solid from "solid-js"
import * as fg from "@nothing-but/force-graph"
import { Ease, Trig } from "@nothing-but/utils"
import { useWindowSize } from "@solid-primitives/resize-observer"

export type RawData = {
  name: string
  prettyName: string
  connections: string[]
}

export function generateNodesFromRawData(
  raw_data: RawData[]
): [fg.graph.Node[], fg.graph.Edge[]] {
  const nodes_map = new Map<string, fg.graph.Node>()
  const edges: fg.graph.Edge[] = []

  for (const raw of raw_data) {
    const node = fg.graph.zeroNode()
    node.key = raw.name
    node.label = raw.prettyName
    nodes_map.set(raw.name, node)
  }

  for (const raw of raw_data) {
    const node_a = nodes_map.get(raw.name)!

    for (const name_b of raw.connections) {
      const node_b = nodes_map.get(name_b)!
      const edge = fg.graph.connect(node_a, node_b)
      edges.push(edge)
    }
  }

  const nodes = Array.from(nodes_map.values())

  return [nodes, edges]
}

// export function generateInitialGraph(length: number = 256): NodesData {
//   const nodes: fg.graph.Node[] = Array.from({ length }, fg.graph.makeNode)
//   const edges: fg.graph.Edge[] = []

//   for (let i = 0; i < length; i++) {
//     const node = nodes[i]!

//     if (node.edges.length > 0 && Math.random() < 0.8) continue

//     const b_index = Num.random_int(length)
//     let node_b = nodes[b_index]!

//     if (node_b === node) {
//       node_b = nodes[(b_index + 1) % length]!
//     }

//     edges.push(fg.graph.connect(node, node_b))
//   }

//   return {
//     nodes,
//     edges,
//     getLabel: (node) => String(node.key)
//   }
// }

const graph_options = fg.graph.graphOptions({
  inertia_strength: 0.3,
  origin_strength: 0.01,
  repel_distance: 22,
  repel_strength: 0.5,
  link_strength: 0.015
})

export function createForceGraph(
  raw_data: RawData[],
  onNodeClick: (name: string) => void
): HTMLCanvasElement {
  const [nodes, edges] = generateNodesFromRawData(raw_data)

  fg.graph.randomizeNodePositions(nodes, graph_options.grid_size)

  const graph = fg.graph.makeGraph(graph_options, nodes, edges)

  const el = document.createElement("canvas")
  el.className = "absolute w-full h-full"

  const ctx = el.getContext("2d")
  if (!ctx) throw new Error("no context")

  const canvas = fg.canvas.canvasState({
    ...fg.canvas.DEFAULT_OPTIONS,
    el,
    ctx,
    graph,
    max_scale: 4,
    init_scale: 2,
    init_grid_pos: Trig.ZERO
  })

  const TITLE_SIZE_PX = 600
  const window_size = useWindowSize()

  const animation = fg.anim.frameAnimation({
    ...fg.anim.DEFAULT_OPTIONS,
    onIteration(alpha) {
      alpha = alpha / 2 // slow things down a bit

      fg.graph.simulate(graph, alpha)

      /*
        Push nodes away from the center (the title)
      */
      const grid_radius = graph.grid.size / 2
      const origin_x = grid_radius + canvas.translate.x
      const origin_y = grid_radius + canvas.translate.y
      const vw = window_size.width
      const vh = window_size.height
      const vmax = Math.max(vw, vh)
      const push_radius =
        (Math.min(TITLE_SIZE_PX, vw, vh) / vmax) *
          (graph.grid.size / canvas.scale) +
        20 /* additional margin for when scrolled in */

      for (const node of graph.nodes) {
        const dist_x = node.position.x - origin_x
        const dist_y = (node.position.y - origin_y) * 2
        const dist = Math.sqrt(dist_x * dist_x + dist_y * dist_y)
        if (dist > push_radius) continue

        const strength = Ease.in_expo((push_radius - dist) / push_radius)

        node.velocity.x += strength * (node.position.x - origin_x) * 10 * alpha
        node.velocity.y += strength * (node.position.y - origin_y) * 10 * alpha
      }
    },
    onFrame() {
      fg.canvas.drawCanvas(canvas)
    }
  })
  fg.anim.bump(animation)

  solid.onCleanup(() => fg.anim.cleanup(animation))

  const ro = fg.canvas.resizeObserver(el, (size) => {
    fg.canvas.updateCanvasSize(canvas, size)
    fg.anim.requestFrame(animation)
  })
  solid.onCleanup(() => ro.disconnect())

  const gestures = fg.canvas.canvasGestures({
    canvas,
    onTranslate() {
      fg.anim.bump(animation)
    },
    onNodeClick(node) {
      onNodeClick(node.key as string)
    },
    onNodeHover(node) {
      canvas.hovered_node = node
    },
    onNodeDrag(node, pos) {
      fg.graph.changeNodePosition(canvas.options.graph.grid, node, pos.x, pos.y)
      fg.anim.requestFrame(animation)
    },
    onModeChange(mode) {
      if (mode === fg.canvas.Mode.DraggingNode) {
        fg.anim.start(animation)
      } else {
        fg.anim.pause(animation)
      }
    }
  })
  solid.onCleanup(() => fg.canvas.cleanupCanvasGestures(gestures))

  return el
}
