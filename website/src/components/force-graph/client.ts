import * as solid from "solid-js"
import { Canvas, Graph, Anim } from "@nothing-but/force-graph"
import { Ease, Num } from "@nothing-but/utils"

const graph_options = Graph.graphOptions({
  inertia_strength: 0.3,
  origin_strength: 0.01,
  repel_distance: 22,
  repel_strength: 0.5,
})

function generateInitialGraph(length: number = 256): Graph.Graph {
  const nodes: Graph.Node[] = Array.from({ length }, Graph.makeNode)
  const edges: Graph.Edge[] = []

  for (let i = 0; i < length; i++) {
    const node = nodes[i]!

    if (node.edges.length > 0 && Math.random() < 0.8) continue

    const b_index = Num.random_int(length)
    let node_b = nodes[b_index]!

    if (node_b === node) {
      node_b = nodes[(b_index + 1) % length]!
    }

    edges.push(Graph.connect(node, node_b))
  }

  Graph.randomizeNodePositions(nodes, graph_options.grid_size)

  return Graph.makeGraph(graph_options, nodes, edges)
}

export function createForceGraph(): HTMLCanvasElement {
  const graph = generateInitialGraph()

  const el = document.createElement("canvas")
  el.className = "absolute w-full h-full"

  const ctx = el.getContext("2d")
  if (!ctx) throw new Error("no context")

  const canvas = Canvas.canvasState({
    ...Canvas.default_options,
    el,
    ctx,
    graph,
    init_scale: 2,
  })

  const animation = Anim.frameAnimation({
    ...Anim.default_options,
    onIteration(alpha) {
      Graph.simulate(graph, alpha)

      /*
        Push nodes away from the center (the title)
      */
      const grid_radius = graph.grid.size / 2
      const origin_x = grid_radius + canvas.translate.x
      const origin_y = grid_radius + canvas.translate.y

      const push_radius = graph.grid.size / 2 / canvas.scale

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
      Canvas.drawCanvas(canvas)
    },
  })
  Anim.bump(animation)

  solid.onCleanup(() => Anim.cleanup(animation))

  const ro = Canvas.resizeObserver(el, (size) => {
    Canvas.updateCanvasSize(canvas, size)
    Anim.requestFrame(animation)
  })
  solid.onCleanup(() => ro.disconnect())

  const gestures = Canvas.canvasGestures({
    canvas,
    onTranslate() {
      Anim.bump(animation)
    },
    onNodeClick(node) {
      console.log("click", node)
    },
    onNodeHover(node) {
      canvas.hovered_node = node
    },
    onNodeDrag(node, pos) {
      Graph.changeNodePosition(canvas.options.graph.grid, node, pos.x, pos.y)
      Anim.requestFrame(animation)
    },
    onModeChange(mode) {
      if (mode === Canvas.Mode.DraggingNode) {
        Anim.start(animation)
      } else {
        Anim.pause(animation)
      }
    },
  })
  solid.onCleanup(() => Canvas.cleanupCanvasGestures(gestures))

  return el
}
