"use client"

import * as react    from "react"
import * as fg       from "@nothing-but/force-graph"
import {ease, trig}  from "@nothing-but/utils"

import * as schedule from "@/lib/utils/schedule"
import * as ws       from "@/lib/utils/window-size"
import * as canvas   from "@/lib/utils/canvas"

import * as anim     from "./anim"

export type RawGraphNode = {
	name:            string,
	prettyName:      string,
	connectedTopics: string[],
}

type HSL = [hue: number, saturation: number, lightness: number]

const COLORS: readonly HSL[] = [
	[3, 86, 64],
	[31, 90, 69],
	[15, 87, 66]
]

/* use a plain object instead of Map for faster lookups */
type ColorMap = { [key: string]: string }
type HSLMap = Map<fg.graph.Node, HSL>

const MAX_COLOR_ITERATIONS = 10

/**
 * Add a color to a node and all its connected nodes.
 */
const visitColorNode = (
	prev: fg.graph.Node,
	node: fg.graph.Node,
	hsl_map: HSLMap,
	add: HSL,
	iteration: number = 1
): void => {
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

	for (const edge of node.edges) {
		const other_node = edge.a === node ? edge.b : edge.a
		if (other_node === prev) continue
		visitColorNode(node, other_node, hsl_map, add, iteration + 1)
	}
}

function generateColorMap(nodes: readonly fg.graph.Node[]): ColorMap
{
	const hls_map: HSLMap = new Map()

	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i]!
		const color = COLORS[i % COLORS.length]!
		visitColorNode(node, node, hls_map, color)
	}

	const color_map: ColorMap = {}
	for (const [node, [hue, saturation, lightness]] of hls_map.entries()) {
		color_map[node.key as string] = `${hue} ${saturation}% ${lightness}%`
	}

	return color_map
}

function generateNodesFromRawData(raw_data: RawGraphNode[]): [fg.graph.Node[], fg.graph.Edge[]]
{
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

		for (const name_b of raw.connectedTopics) {
			const node_b = nodes_map.get(name_b)!
			const edge = fg.graph.connect(node_a, node_b)
			edges.push(edge)
		}
	}

	const nodes = Array.from(nodes_map.values())

	fg.graph.randomizeNodePositions(nodes, GRAPH_OPTIONS.grid_size)

	return [nodes, edges]
}

function filterNodes(
	graph: fg.graph.Graph,
	nodes: readonly fg.graph.Node[],
	edges: readonly fg.graph.Edge[],
	filter: string
): void {
	if (filter === "") {
		graph.nodes = nodes.slice()
		graph.edges = edges.slice()
		fg.graph.resetGraphGrid(graph.grid, graph.nodes)
		return
	}

	// regex matching all letters of the filter (out of order)
	const regex = new RegExp(filter.split("").join(".*"), "i")

	graph.nodes = nodes.filter((node) => regex.test(node.label))
	graph.edges = edges.filter(
		(edge) => regex.test(edge.a.label) && regex.test(edge.b.label)
	)

	fg.graph.resetGraphGrid(graph.grid, graph.nodes)
}

const GRAPH_OPTIONS: fg.graph.Options = {
	min_move:         0.001,
	inertia_strength: 0.3,
	origin_strength:  0.01,
	repel_distance:   40,
	repel_strength:   2,
	link_strength:    0.015,
	grid_size:        500,
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
	let grid_radius = graph.grid.size / 2
	let origin_x    = grid_radius + canvas.translate.x
	let origin_y    = grid_radius + canvas.translate.y
	let vmax        = Math.max(vw, vh)
	let push_radius =
		(Math.min(TITLE_SIZE_PX, vw / 2, vh / 2) / vmax) *
		(graph.grid.size / canvas.scale) +
		80 /* additional margin for when scrolled in */

	for (let node of graph.nodes) {
		let dist_x =  node.position.x - origin_x
		let dist_y = (node.position.y - origin_y) * 2
		let dist   = Math.sqrt(dist_x * dist_x + dist_y * dist_y)
		if (dist > push_radius) continue

		let strength = ease.in_expo((push_radius - dist) / push_radius)

		node.velocity.x += strength * (node.position.x - origin_x) * 10 * alpha
		node.velocity.y += strength * (node.position.y - origin_y) * 10 * alpha
	}
}

const drawGraph = (
	canvas: fg.canvas.CanvasState,
	color_map: ColorMap
): void => {
	fg.canvas.resetFrame(canvas)
	fg.canvas.drawEdges(canvas)

	/*
		Draw text nodes
	*/
	let {ctx, graph}    = canvas
	let {width, height} = canvas.ctx.canvas
	let max_size        = Math.max(width, height)

	ctx.textAlign = "center"
	ctx.textBaseline = "middle"

	for (let node of graph.nodes) {

		let opacity = 0.6 + ((node.mass-1) / 50) * 4

		ctx.font = `${max_size/200 + (((node.mass-1) / 5) * (max_size/100)) / canvas.scale}px sans-serif`

		ctx.fillStyle = node.anchor || canvas.hovered_node === node
			? `rgba(129, 140, 248, ${opacity})`
			: `hsl(${color_map[node.key as string]} / ${opacity})`

		ctx.fillText(node.label,
			(node.position.x / graph.grid.size) * max_size,
			(node.position.y / graph.grid.size) * max_size)
	}
}

class State {	
	ctx: CanvasRenderingContext2D | null = null

	nodes: fg.graph.Node[] = []
	edges: fg.graph.Edge[] = []
	graph: fg.graph.Graph  = fg.graph.makeGraph(GRAPH_OPTIONS, [], [])
	gestures: fg.canvas.CanvasGestures | null = null

	loop: anim.AnimationLoop | null = null
	bump_end = 0
	alpha = 9
	frame_iter_limit = anim.frameIterationsLimit()
	schedule_filter = schedule.scheduleIdle(filterNodes)
	ro: ResizeObserver = new ResizeObserver(() => {})
}

function init(
	s    : State,
	props: {
		onNodeClick: (name: string) => void
		raw_nodes: RawGraphNode[]
		canvas_el: HTMLCanvasElement | null
}) {
	let {canvas_el, raw_nodes} = props

	if (canvas_el == null) return

	s.ctx = canvas_el.getContext("2d")
	if (s.ctx == null) return

	[s.nodes, s.edges] = generateNodesFromRawData(raw_nodes)
	let color_map      = generateColorMap(s.nodes)

	s.graph = fg.graph.makeGraph(GRAPH_OPTIONS, s.nodes.slice(), s.edges.slice())

	let canvas_state = fg.canvas.canvasState({
		ctx:           s.ctx,
		graph:         s.graph,
		max_scale:     3,
		init_scale:    1.7,
		init_grid_pos: trig.ZERO
	})

	s.ro = new ResizeObserver(() => {
		if (canvas.resizeCanvasToDisplaySize(canvas_el)) {
			fg.canvas.updateTranslate(canvas_state, canvas_state.translate.x, canvas_state.translate.y)
		}
	})
	s.ro.observe(canvas_el)

	let loop = s.loop = anim.animationLoop((time) => {
		let is_active = gestures.mode.type === fg.canvas.Mode.DraggingNode
		let iterations = anim.calcIterations(s.frame_iter_limit, time)

		for (let i = Math.min(iterations, 2); i >= 0; i--) {
			s.alpha = anim.updateAlpha(s.alpha, is_active || time < s.bump_end)
			simulateGraph(s.alpha, s.graph, canvas_state, window.innerWidth, window.innerHeight)
		}
		drawGraph(canvas_state, color_map)
	})
	anim.loopStart(loop)

	let gestures = s.gestures = fg.canvas.canvasGestures({
		canvas: canvas_state,
		onGesture: (e) => {
			switch (e.type) {
			case fg.canvas.GestureEventType.Translate:
				s.bump_end = anim.bump(s.bump_end)
				break
			case fg.canvas.GestureEventType.NodeClick:
				props.onNodeClick(e.node.key as string)
				break
			case fg.canvas.GestureEventType.NodeDrag:
				fg.graph.changeNodePosition(
					canvas_state.graph.grid,
					e.node,
					e.pos.x,
					e.pos.y
				)
				break
			}
		}
	})
}

function updateQuery(s: State, filter_query: string) {
	s.schedule_filter.trigger(s.graph, s.nodes, s.edges, filter_query)
	s.bump_end = anim.bump(s.bump_end)
}

function cleanup(s: State) {
	s.loop && anim.loopClear(s.loop)
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
			canvas_el:   canvas_el,
			onNodeClick: props.onNodeClick,
			raw_nodes:   props.raw_nodes,
		})
	}, [canvas_el])

	react.useEffect(() => {
		updateQuery(state.current, props.filter_query)
	}, [props.filter_query])

	react.useEffect(() => {
		return () => cleanup(state.current)
	}, [])

	return <div className="absolute inset-0 overflow-hidden">
		<canvas
			ref={setCanvasEl}
			style={{
				position: "absolute",
				top:    "-10%",
				left:   "-10%",
				width:  "120%",
				height: "120%",
			}}
		/>
	</div>
}
