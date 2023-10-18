import * as solid from "solid-js"
import { Canvas, Graph, Anim } from "@nothing-but/force-graph"
import { Ease } from "@nothing-but/utils"
import { RawData, generateNodesFromData } from "./generate"

const graph_options = Graph.graphOptions({
  inertia_strength: 0.3,
  origin_strength: 0.01,
  repel_distance: 22,
  repel_strength: 0.5
})

export function createForceGraph(
  raw_data: RawData,
  onNodeClick: (name: string) => void
): HTMLCanvasElement {
  const data = generateNodesFromData(raw_data)

  Graph.randomizeNodePositions(data.nodes, graph_options.grid_size)

  const graph = Graph.makeGraph(graph_options, data.nodes, data.edges)

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
    nodeLabel: data.getLabel
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
    }
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
      onNodeClick(node.key as string)
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
    }
  })
  solid.onCleanup(() => Canvas.cleanupCanvasGestures(gestures))

  return el
}
