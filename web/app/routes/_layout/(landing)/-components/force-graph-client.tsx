import * as react from "react"
import * as fg from "@nothing-but/force-graph"
import * as schedule from "@/lib/utils"
import * as canvas from "@/lib/utils"
import { searchSafeRegExp } from "@/lib/utils"
import { ease, trig, raf, color } from "@nothing-but/utils"

export type RawGraphNode = {
  name: string
  prettyName: string
  connectedTopics: string[]
}

const COLORS: readonly color.HSL[] = [
  [3, 86, 64],
  [15, 87, 66],
  [31, 90, 69],
  [15, 87, 66],
  [31, 90, 69],
  [344, 87, 70],
]

type ColorMap = Record<string, color.HSL>

function generateColorMap(g: fg.graph.Graph): ColorMap {
  const hsl_map: ColorMap = {}

  for (let i = 0; i < g.nodes.length; i++) {
    hsl_map[g.nodes[i].key as string] = COLORS[i % COLORS.length]
  }

  for (const { a, b } of g.edges) {
    const a_hsl = hsl_map[a.key as string]
    const b_hsl = hsl_map[b.key as string]

    const am = a.mass - 1
    const bm = b.mass - 1

    hsl_map[a.key as string] = color.mix(a_hsl, b_hsl, am * am * am, bm)
    hsl_map[b.key as string] = color.mix(a_hsl, b_hsl, am, bm * bm * bm)
  }

  return hsl_map
}

function generateNodesFromRawData(
  g: fg.graph.Graph,
  raw_data: RawGraphNode[],
): void {
  const nodes_map = new Map<string, fg.graph.Node>()

  /* create nodes */
  for (const raw of raw_data) {
    const node = fg.graph.make_node()
    node.key = raw.name
    node.label = raw.prettyName

    fg.graph.add_node(g, node)
    nodes_map.set(raw.name, node)
  }

  /* connections */
  for (const raw of raw_data) {
    const node_a = nodes_map.get(raw.name)!

    for (const name_b of raw.connectedTopics) {
      const node_b = nodes_map.get(name_b)!
      fg.graph.connect(g, node_a, node_b)
    }
  }

  /* calc mass from number of connections */
  for (const node of g.nodes) {
    const edges = fg.graph.get_node_edges(g, node)
    node.mass = fg.graph.node_mass_from_edges(edges.length)
  }
}

function filterNodes(s: State, filter: string): void {
  fg.graph.clear_nodes(s.graph)

  if (filter === "") {
    fg.graph.add_nodes(s.graph, s.nodes)
    fg.graph.add_edges(s.graph, s.edges)
  } else {
    // regex matching all letters of the filter (out of order)
    const regex = searchSafeRegExp(filter)

    fg.graph.add_nodes(
      s.graph,
      s.nodes.filter((node) => regex.test(node.label)),
    )
    fg.graph.add_edges(
      s.graph,
      s.edges.filter(
        (edge) => regex.test(edge.a.label) && regex.test(edge.b.label),
      ),
    )
  }
}

const GRAPH_OPTIONS: fg.graph.Options = {
  min_move: 0.001,
  inertia_strength: 0.3,
  origin_strength: 0.01,
  repel_distance: 40,
  repel_strength: 2,
  link_strength: 0.03,
  grid_size: 500,
}

const TITLE_SIZE_PX = 400

const simulateGraph = (
  alpha: number,
  gestures: fg.canvas.CanvasGestures,
  vw: number,
  vh: number,
): void => {
  const c = gestures.canvas
  const g = c.graph

  alpha = alpha / 10 // slow things down a bit

  fg.graph.simulate(g, alpha)

  /*
		Push nodes away from the center (the title)
	*/
  const grid_radius = g.options.grid_size / 2
  const origin_x = grid_radius + c.translate.x
  const origin_y = grid_radius + c.translate.y
  const vmax = Math.max(vw, vh)
  const push_radius =
    (Math.min(TITLE_SIZE_PX, vw / 2, vh / 2) / vmax) *
      (g.options.grid_size / c.scale) +
    80 /* additional margin for when scrolled in */

  for (const node of g.nodes) {
    //
    const dist_x = node.pos.x - origin_x
    const dist_y = (node.pos.y - origin_y) * 2
    const dist = Math.sqrt(dist_x * dist_x + dist_y * dist_y)
    if (dist > push_radius) continue

    const strength = ease.in_expo((push_radius - dist) / push_radius)

    node.vel.x += strength * (node.pos.x - origin_x) * 10 * alpha
    node.vel.y += strength * (node.pos.y - origin_y) * 10 * alpha
  }

  /*
		When a node is being dragged
		it will pull it's connections
	*/
  if (gestures.mode.type === fg.canvas.Mode.DraggingNode) {
    //
    const node = gestures.mode.node

    for (const edge of fg.graph.each_node_edge(g, node)) {
      const b = edge.b === node ? edge.a : edge.b

      const dx =
        (b.pos.x - node.pos.x) *
        g.options.link_strength *
        edge.strength *
        alpha *
        10
      const dy =
        (b.pos.y - node.pos.y) *
        g.options.link_strength *
        edge.strength *
        alpha *
        10

      b.vel.x -= dx / b.mass
      b.vel.y -= dy / b.mass
    }
  }
}

const drawGraph = (c: fg.canvas.CanvasState, color_map: ColorMap): void => {
  fg.canvas.resetFrame(c)
  fg.canvas.drawEdges(c)

  /*
		Draw text nodes
	*/
  const grid_size = c.graph.options.grid_size
  const max_size = Math.max(c.ctx.canvas.width, c.ctx.canvas.height)

  const clip_rect = fg.canvas.get_ctx_clip_rect(c.ctx, { x: 100, y: 20 })

  c.ctx.textAlign = "center"
  c.ctx.textBaseline = "middle"

  for (const node of c.graph.nodes) {
    const x = (node.pos.x / grid_size) * max_size
    const y = (node.pos.y / grid_size) * max_size

    if (fg.canvas.in_rect_xy(clip_rect, x, y)) {
      const base_size = max_size / 220
      const mass_boost_size = max_size / 140
      const mass_boost = (node.mass - 1) / 8 / c.scale

      c.ctx.font = `${base_size + mass_boost * mass_boost_size}px sans-serif`

      const opacity = 0.6 + ((node.mass - 1) / 50) * 4

      c.ctx.fillStyle =
        node.anchor || c.hovered_node === node
          ? `rgba(129, 140, 248, ${opacity})`
          : color.hsl_to_hsla_string(color_map[node.key as string], opacity)

      c.ctx.fillText(node.label, x, y)
    }
  }
}

class State {
  ctx: CanvasRenderingContext2D | null = null

  /* copy of all nodes to filter them */
  nodes: fg.graph.Node[] = []
  edges: fg.graph.Edge[] = []

  graph: fg.graph.Graph = fg.graph.make_graph(GRAPH_OPTIONS)
  gestures: fg.canvas.CanvasGestures | null = null

  raf_id: number = 0
  bump_end = 0
  alpha = 0
  frame_iter_limit = raf.frameIterationsLimit(60)
  schedule_filter = schedule.scheduleIdle(filterNodes)
  ro: ResizeObserver | undefined
}

function init(
  s: State,
  props: {
    onNodeClick: (name: string) => void
    raw_nodes: RawGraphNode[]
    canvas_el: HTMLCanvasElement | null
  },
) {
  const { canvas_el, raw_nodes } = props

  if (canvas_el == null) return

  s.ctx = canvas_el.getContext("2d")
  if (s.ctx == null) return

  generateNodesFromRawData(s.graph, raw_nodes)
  fg.graph.set_positions_smart(s.graph)

  s.nodes = s.graph.nodes.slice()
  s.edges = s.graph.edges.slice()

  const color_map = generateColorMap(s.graph)

  const canvas_state = fg.canvas.canvasState({
    ctx: s.ctx,
    graph: s.graph,
    max_scale: 3,
    init_scale: 1.7,
    init_grid_pos: trig.ZERO,
  })

  const gestures = (s.gestures = fg.canvas.canvasGestures({
    canvas: canvas_state,
    onGesture: (e) => {
      switch (e.type) {
        case fg.canvas.GestureEventType.Translate:
          s.bump_end = raf.bump(s.bump_end)
          break
        case fg.canvas.GestureEventType.NodeClick:
          props.onNodeClick(e.node.key as string)
          break
        case fg.canvas.GestureEventType.NodeDrag:
          fg.graph.set_position(canvas_state.graph, e.node, e.pos)
          break
      }
    },
  }))

  s.ro = new ResizeObserver(() => {
    if (canvas.resizeCanvasToDisplaySize(canvas_el)) {
      fg.canvas.updateTranslate(
        canvas_state,
        canvas_state.translate.x,
        canvas_state.translate.y,
      )
    }
  })
  s.ro.observe(canvas_el)

  // initial simulation is the most crazy
  // so it's off-screen
  simulateGraph(6, gestures, window.innerWidth, window.innerHeight)

  function loop(time: number) {
    const is_active = gestures.mode.type === fg.canvas.Mode.DraggingNode
    const iterations = Math.min(2, raf.calcIterations(s.frame_iter_limit, time))

    for (let i = iterations; i > 0; i--) {
      s.alpha = raf.updateAlpha(s.alpha, is_active || time < s.bump_end)
      simulateGraph(s.alpha, gestures, window.innerWidth, window.innerHeight)
    }

    if (iterations > 0) {
      drawGraph(canvas_state, color_map)
    }

    s.raf_id = requestAnimationFrame(loop)
  }
  s.raf_id = requestAnimationFrame(loop)
}

function updateQuery(s: State, filter_query: string) {
  s.schedule_filter.trigger(s, filter_query)
  s.bump_end = raf.bump(s.bump_end)
}

function cleanup(s: State) {
  cancelAnimationFrame(s.raf_id)
  s.gestures && fg.canvas.cleanupCanvasGestures(s.gestures)
  s.schedule_filter.clear()
  s.ro?.disconnect()
}

export type ForceGraphProps = {
  onNodeClick: (name: string) => void
  /**
   * Filter the displayed nodes by name.
   *
   * `""` means no filter
   */
  filter_query: string
  raw_nodes: RawGraphNode[]
}

export function ForceGraphClient(props: ForceGraphProps): react.JSX.Element {
  const [canvas_el, setCanvasEl] = react.useState<HTMLCanvasElement | null>(
    null,
  )

  const state = react.useRef(new State())

  react.useEffect(() => {
    init(state.current, {
      canvas_el: canvas_el,
      onNodeClick: props.onNodeClick,
      raw_nodes: props.raw_nodes,
    })
  }, [canvas_el])

  react.useEffect(() => {
    updateQuery(state.current, props.filter_query)
  }, [props.filter_query])

  react.useEffect(() => {
    return () => cleanup(state.current)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <canvas
        ref={setCanvasEl}
        style={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: "120%",
          height: "120%",
        }}
      />
    </div>
  )
}

export default ForceGraphClient
