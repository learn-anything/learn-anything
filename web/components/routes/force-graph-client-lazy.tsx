"use client"

import * as react from "react"
import * as fg from "@nothing-but/force-graph"
import { ease, trig, raf } from "@nothing-but/utils"

import * as schedule from "@/lib/utils/schedule"
import * as canvas from "@/lib/utils/canvas"

export type RawGraphNode = {
	name: string
	prettyName: string
	connectedTopics: string[]
}

type HSL = [hue: number, saturation: number, lightness: number]

const COLORS: readonly HSL[] = [
	[3, 86, 64],
	[31, 90, 69],
	[15, 87, 66]
]

/* use a plain object instead of Map for faster lookups */
type ColorMap = {[key: string]: string}
type HSLMap   = Map<fg.graph.Node, HSL>

const MAX_COLOR_ITERATIONS = 10

/**
 * Add a color to a node and all its connected nodes.
 */
function visitColorNode(
	g:         fg.graph.Graph,
	prev:      fg.graph.Node,
	node:      fg.graph.Node,
	hsl_map:   HSLMap,
	add:       HSL,
	iteration: number = 1
): void {
	if (iteration > MAX_COLOR_ITERATIONS) return

	const color = hsl_map.get(node)

	if (!color) {
		hsl_map.set(node, [...add])
	} else {
		const add_strength = MAX_COLOR_ITERATIONS / iteration
		color[0] = (color[0] + add[0] * add_strength) / (1 + add_strength)
		color[1] = (color[1] + add[1] * add_strength) / (1 + add_strength)
		color[2] = (color[2] + add[2] * add_strength) / (1 + add_strength)
	}

	for (let edge of g.edges) {
		let b: fg.graph.Node
		if      (edge.a === node) b = edge.b
		else if (edge.b === node) b = edge.a
		else continue
		if (b !== prev) {
			visitColorNode(g, node, b, hsl_map, add, iteration + 1)
		}
	}
}

function generateColorMap(g: fg.graph.Graph, nodes: readonly fg.graph.Node[]): ColorMap {
	const hls_map: HSLMap = new Map()

	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i]!
		const color = COLORS[i % COLORS.length]!
		visitColorNode(g, node, node, hls_map, color)
	}

	const color_map: ColorMap = {}
	for (const [node, [hue, saturation, lightness]] of hls_map.entries()) {
		color_map[node.key as string] = `${hue} ${saturation}% ${lightness}%`
	}

	return color_map
}

function generateNodesFromRawData(g: fg.graph.Graph, raw_data: RawGraphNode[]): void {
	const nodes_map = new Map<string, fg.graph.Node>()

	for (const raw of raw_data) {
		const node = fg.graph.make_node()
		node.key = raw.name
		node.label = raw.prettyName

		fg.graph.add_node(g, node)
		nodes_map.set(raw.name, node)
	}

	for (const raw of raw_data) {
		const node_a = nodes_map.get(raw.name)!

		for (const name_b of raw.connectedTopics) {
			const node_b = nodes_map.get(name_b)!
			fg.graph.connect(g, node_a, node_b)
		}
	}

	fg.graph.spread_positions(g)
}

function filterNodes(
	s: State,
	filter: string
): void {
	fg.graph.clear_nodes(s.graph)

	if (filter === "") {
		s.graph.nodes.push(...s.nodes)
		s.graph.edges.push(...s.edges)
	} else {
		// regex matching all letters of the filter (out of order)
		const regex = new RegExp(filter.split("").join(".*"), "i")
	
		s.graph.nodes = s.nodes.filter(node => regex.test(node.label))
		s.graph.edges = s.edges.filter(edge => regex.test(edge.a.label) && regex.test(edge.b.label))
	}

	fg.graph.add_nodes_to_grid(s.graph, s.nodes)
}

const GRAPH_OPTIONS: fg.graph.Options = {
	min_move: 0.001,
	inertia_strength: 0.3,
	origin_strength: 0.01,
	repel_distance: 40,
	repel_strength: 2,
	link_strength: 0.015,
	grid_size: 500
}

const TITLE_SIZE_PX = 400

const simulateGraph = (
	alpha: number,
	graph: fg.graph.Graph,
	canvas: fg.canvas.CanvasState,
	vw: number,
	vh: number
): void => {
	alpha = alpha / 10 // slow things down a bit

	fg.graph.simulate(graph, alpha)

	/*
		Push nodes away from the center (the title)
	*/
	let grid_radius = graph.options.grid_size / 2
	let origin_x = grid_radius + canvas.translate.x
	let origin_y = grid_radius + canvas.translate.y
	let vmax = Math.max(vw, vh)
	let push_radius =
		(Math.min(TITLE_SIZE_PX, vw / 2, vh / 2) / vmax) * (graph.options.grid_size / canvas.scale) +
		80 /* additional margin for when scrolled in */

	for (let node of graph.nodes) {

		let dist_x = node.pos.x - origin_x
		let dist_y = (node.pos.y - origin_y) * 2
		let dist = Math.sqrt(dist_x * dist_x + dist_y * dist_y)
		if (dist > push_radius) continue

		let strength = ease.in_expo((push_radius - dist) / push_radius)

		node.vel.x += strength * (node.pos.x - origin_x) * 10 * alpha
		node.vel.y += strength * (node.pos.y - origin_y) * 10 * alpha
	}
}

const drawGraph = (c: fg.canvas.CanvasState, color_map: ColorMap): void => {
	fg.canvas.resetFrame(c)
	fg.canvas.drawEdges(c)

	/*
		Draw text nodes
	*/
	let grid_size = c.graph.options.grid_size
	let max_size  = Math.max(c.ctx.canvas.width, c.ctx.canvas.height)

	let clip_rect = fg.canvas.get_ctx_clip_rect(c.ctx, {x: 100, y: 20})

	c.ctx.textAlign = "center"
	c.ctx.textBaseline = "middle"

	for (let node of c.graph.nodes) {

		let x = node.pos.x / grid_size * max_size
		let y = node.pos.y / grid_size * max_size

		if (fg.canvas.in_rect_xy(clip_rect, x, y)) {
			
			let opacity = 0.6 + ((node.mass - 1) / 50) * 4
	
			c.ctx.font = `${max_size / 200 + (((node.mass - 1) / 5) * (max_size / 100)) / c.scale}px sans-serif`
	
			c.ctx.fillStyle = node.anchor || c.hovered_node === node
				? `rgba(129, 140, 248, ${opacity})`
				: `hsl(${color_map[node.key as string]} / ${opacity})`
	
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
	alpha = 9
	frame_iter_limit = raf.frameIterationsLimit()
	schedule_filter = schedule.scheduleIdle(filterNodes)
	ro: ResizeObserver = new ResizeObserver(() => {})
}

function init(
	s: State,
	props: {
		onNodeClick: (name: string) => void
		raw_nodes: RawGraphNode[]
		canvas_el: HTMLCanvasElement | null
	}
) {
	let {canvas_el, raw_nodes} = props

	if (canvas_el == null) return

	s.ctx = canvas_el.getContext("2d")
	if (s.ctx == null) return

	generateNodesFromRawData(s.graph, raw_nodes)
	s.nodes = s.graph.nodes.slice()
	s.edges = s.graph.edges.slice()

	let color_map = generateColorMap(s.graph, s.nodes)

	let canvas_state = fg.canvas.canvasState({
		ctx: s.ctx,
		graph: s.graph,
		max_scale: 3,
		init_scale: 1.7,
		init_grid_pos: trig.ZERO
	})

	s.ro = new ResizeObserver(() => {
		if (canvas.resizeCanvasToDisplaySize(canvas_el)) {
			fg.canvas.updateTranslate(canvas_state, canvas_state.translate.x, canvas_state.translate.y)
		}
	})
	s.ro.observe(canvas_el)

	function loop(time: number) {
		let is_active = gestures.mode.type === fg.canvas.Mode.DraggingNode
		let iterations = Math.min(2, raf.calcIterations(s.frame_iter_limit, time))

		for (let i = iterations; i >= 0; i--) {
			s.alpha = raf.updateAlpha(s.alpha, is_active || time < s.bump_end)
			simulateGraph(s.alpha, s.graph, canvas_state, window.innerWidth, window.innerHeight)
		}
		
		drawGraph(canvas_state, color_map)

		s.raf_id = requestAnimationFrame(loop)
	}
	s.raf_id = requestAnimationFrame(loop)

	let gestures = (s.gestures = fg.canvas.canvasGestures({
		canvas: canvas_state,
		onGesture: e => {
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
		}
	}))
}

function updateQuery(s: State, filter_query: string) {
	s.schedule_filter.trigger(s, filter_query)
	s.bump_end = raf.bump(s.bump_end)
}

function cleanup(s: State) {
	cancelAnimationFrame(s.raf_id)
	s.gestures && fg.canvas.cleanupCanvasGestures(s.gestures)
	s.schedule_filter.clear()
	s.ro.disconnect()
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

export default function ForceGraphClient(props: ForceGraphProps): react.JSX.Element {
	const [canvas_el, setCanvasEl] = react.useState<HTMLCanvasElement | null>(null)

	const state = react.useRef(new State())

	react.useEffect(() => {
		init(state.current, {
			canvas_el: canvas_el,
			onNodeClick: props.onNodeClick,
			raw_nodes: props.raw_nodes
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
					height: "120%"
				}}
			/>
		</div>
	)
}
