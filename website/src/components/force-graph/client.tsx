import * as s from "solid-js"
import * as fg from "@nothing-but/force-graph"
import { Ease, Trig } from "@nothing-but/utils"
import { useWindowSize } from "@solid-primitives/resize-observer"
import * as schedule from "@solid-primitives/scheduled"

export type RawNode = {
  name: string
  prettyName: string
  connections: string[]
}

export function generateNodesFromRawData(
  raw_data: RawNode[]
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

  fg.graph.randomizeNodePositions(nodes, graph_options.grid_size)

  return [nodes, edges]
}

const graph_options: fg.graph.Options = {
  min_move: 0.001,
  inertia_strength: 0.3,
  origin_strength: 0.01,
  repel_distance: 40,
  repel_strength: 2,
  link_strength: 0.015,
  grid_size: 500
}

const filterToRegex = (filter: string): RegExp => {
  // regex matching all letters of the filter (out of order)
  const letters = filter.split("")
  const regex = new RegExp(letters.join(".*"), "i")
  return regex
}

const filterNodes = (
  graph: fg.graph.Graph,
  nodes: readonly fg.graph.Node[],
  edges: readonly fg.graph.Edge[],
  filter: string
): void => {
  if (filter === "") {
    graph.nodes = nodes.slice()
    graph.edges = edges.slice()
    fg.graph.resetGraphGrid(graph.grid, graph.nodes)
    return
  }

  const regex = filterToRegex(filter)

  const new_nodes = nodes.filter((node) => regex.test(node.label))
  const new_edges = edges.filter(
    (edge) => regex.test(edge.a.label) && regex.test(edge.b.label)
  )

  graph.nodes = new_nodes
  graph.edges = new_edges

  fg.graph.resetGraphGrid(graph.grid, graph.nodes)
}

export type ForceGraphProps = {
  onNodeClick: (name: string) => void
  /**
   * Filter the displayed nodes by name.
   *
   * `""` means no filter
   */
  filterQuery: s.Accessor<string>
  raw_nodes: RawNode[]
}

export function createForceGraph(props: ForceGraphProps): s.JSXElement {
  if (props.raw_nodes.length === 0) return

  const [nodes, edges] = generateNodesFromRawData(props.raw_nodes)

  const graph = fg.graph.makeGraph(graph_options, nodes.slice(), edges.slice())

  /*
    Filter nodes when the filter query changes
  */
  const scheduleFilterNodes = schedule.scheduleIdle(filterNodes)
  s.createEffect(() => {
    const query = props.filterQuery()

    scheduleFilterNodes(graph, nodes, edges, query)
  })

  let canvas_el!: HTMLCanvasElement
  const root_el = (
    <div class="absolute inset-0 overflow-hidden">
      <canvas
        ref={canvas_el}
        style={`
          position: absolute;
          top: -10%;
          left: -10%;
          width: 120%;
          height: 120%;
        `}
      />
    </div>
  )

  const ctx = canvas_el.getContext("2d")
  if (!ctx) throw new Error("no context")

  const canvas = fg.canvas.canvasState({
    el: canvas_el,
    ctx,
    graph,
    max_scale: 3,
    init_scale: 1.7,
    init_grid_pos: Trig.ZERO
  })

  const TITLE_SIZE_PX = 400
  const window_size = useWindowSize()

  const animation = fg.anim.frameAnimation({
    ...fg.anim.DEFAULT_OPTIONS,
    onIteration(alpha) {
      alpha = alpha / 3 // slow things down a bit

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
        (Math.min(TITLE_SIZE_PX, vw / 2, vh / 2) / vmax) *
          (graph.grid.size / canvas.scale) +
        80 /* additional margin for when scrolled in */

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

  s.onCleanup(() => fg.anim.cleanup(animation))

  const ro = fg.canvas.resizeObserver(canvas_el, (size) => {
    fg.canvas.updateCanvasSize(canvas, size)
    fg.anim.requestFrame(animation)
  })
  s.onCleanup(() => ro.disconnect())

  const gestures = fg.canvas.canvasGestures({
    canvas,
    onTranslate() {
      fg.anim.bump(animation)
    },
    onNodeClick(node) {
      props.onNodeClick(node.key as string)
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
  s.onCleanup(() => fg.canvas.cleanupCanvasGestures(gestures))

  return root_el
}
