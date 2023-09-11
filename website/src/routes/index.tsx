import { createShortcut } from "@solid-primitives/keyboard"
import {
  For,
  Show,
  createEffect,
  createResource,
  createSignal,
  onCleanup,
  onMount,
  untrack,
} from "solid-js"
import { useNavigate } from "solid-start"
import { Canvas, Graph, Anim } from "@nothing-but/force-graph"
import { Num } from "@nothing-but/utils"
import { getHankoCookie } from "../../lib/auth"
import { useMobius } from "../root"

// TODO: add fuzzy search of topics, especially consider lower case should also match

export const graph_options = Graph.graphOptions({
  inertia_strength: 0.3,
  origin_strength: 0.01,
  repel_distance: 22,
  repel_strength: 0.5,
})

export function generateInitialGraph(length: number = 256): Graph.Graph {
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

type TopicSearchResult = {
  prettyName: string,
  name: string
}

// TODO: load the graph with graph data from server (no undefined flying around)
export default function Home() {
  const navigate = useNavigate()
  const mobius = useMobius()
  const [topics, setTopics] = createSignal<TopicSearchResult[]>([])

  createEffect(() => {
    console.log(topics(), "topics")
  })

  onMount(async () => {
    const res = await mobius.query({
      publicGetGlobalTopics: {
        prettyName: true,
        name: true
      }
    })
    console.log(res)
    if (res) {
      // TODO: no idea why it complains
      // @ts-ignore
      setTopics(res.data?.publicGetGlobalTopics)
    }
  })

  const [topicSearchResults, setTopicSearchResults] = createSignal<string[]>([])
  const [topicSearchInput, setTopicSearchInput] = createSignal("")
  const [focusedTopic, setFocusedTopic] = createSignal(0)
  const [focusedTodoTitle, setFocusedTodoTitle] = createSignal("")

  const [hankoCookie] = createResource(() => {
    const hankoCookie = getHankoCookie()
    return hankoCookie
  })

  const graph = generateInitialGraph()

  const el = (<canvas class="absolute w-full h-full" />) as HTMLCanvasElement

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
    },
    onFrame() {
      Canvas.drawCanvas(canvas)
    },
  })
  Anim.bump(animation)

  onCleanup(() => Anim.cleanup(animation))

  const ro = Canvas.resizeObserver(el, (size) => {
    Canvas.updateCanvasSize(canvas, size)
    Anim.requestFrame(animation)
  })
  onCleanup(() => ro.disconnect())

  const gestures = Canvas.canvasGestures({
    canvas,
    onTranslate() {
      Anim.requestFrame(animation)
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
  onCleanup(() => Canvas.cleanupCanvasGestures(gestures))

  createShortcut(["ARROWDOWN"], () => {
    if (focusedTopic() === topicSearchResults().length - 1) {
      setFocusedTopic(0)
      return
    }
    setFocusedTopic(focusedTopic() + 1)
  })
  createShortcut(["ARROWUP"], () => {
    if (focusedTopic() === 0) {
      setFocusedTopic(topicSearchResults().length - 1)
      return
    }
    setFocusedTopic(focusedTopic() - 1)
  })

  createEffect(() => {
    if (topicSearchInput()) {
      untrack(() => {
        setTopicSearchResults(topics().map(topic => topic.prettyName))
        setTopicSearchResults(
          topicSearchResults().filter((word: any) =>
            topicSearchInput()
              .split("")
              .every((v) => {
                return word.split("").includes(v)
              }),
          ),
        )
        console.log(topicSearchResults())
      })
      setFocusedTodoTitle(topicSearchResults()[focusedTopic()])
    }
  })

  return (
    <>
      <style>
        {`
    #Focused {
      background-color: rgb(237 237 237);
      color: rgb(23 23 23);
    }
    #UnFocused {
      background-color: transparent;
      color: rgb(38 38 38);
    }
    #RotatePlanet {
      animation: 20s RotatePlanets infinite linear;
    }
    @keyframes RotatePlanets {
      0% {
        transform: rotate(0deg)
      }
      100% {
        transform: rotate(360deg)
      }
    }

    `}
      </style>
      <div class="w-full h-full">
        <div class="w-screen bg-neutral-950 text-white h-screen flex flex-col  items-center justify-start">
          <div class="flex flex-col gap-1 items-center p-[50px] z-50">
            <div
              class=" tracking-wide font-bold bg-clip-text text-transparent"
              style={{
                "background-image":
                  "linear-gradient(145deg, #fff 65%, rgba(255,255,255,.43))",
                "font-size": "clamp(3rem, 10vw, 5rem)",
              }}
            >
              I want to learn
            </div>
            <div class="w-full relative flex flex-col gap-3">
              <input
                type="text"
                placeholder="Search"
                onInput={(e) => {
                  setTopicSearchInput(e.target.value)
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    // console.log(e.target.value)
                    console.log(focusedTodoTitle())
                    if (focusedTodoTitle()) {
                      navigate(
                        focusedTodoTitle().toLowerCase().replace(/ /g, "-"),
                      )
                    }
                  }
                }}
                class=" rounded text-lg font-semibold py-2 px-4 outline-none text-black"
                style={{ width: "100%" }}
              />
              <Show
                when={
                  topicSearchInput() !== "" && topicSearchResults().length !== 0
                }
              >
                <div class="bg-white p-2 absolute top-12 left-0 text-black font-semibold text-opacity-40 flex flex-col rounded w-full">
                  <For each={topicSearchResults()}>
                    {(topic) => (
                      <div
                        id={
                          focusedTodoTitle() === topic ? "Focused" : "UnFocused"
                        }
                        onClick={() => {
                          setFocusedTopic(topicSearchResults().indexOf(topic))
                        }}
                        class="px-4 overflow-auto py-2 rounded-lg"
                      >
                        <div>{topic}</div>
                      </div>
                    )}
                  </For>
                </div>
              </Show>
            </div>
          </div>
          <div class="w-[80%] flex justify-center">{el}</div>
          <Show when={!hankoCookie}>
            <div
              onClick={() => {
                navigate("/auth")
              }}
              class="absolute top-5 right-5 hover:text-green-400 font-bold text-lg transition-all cursor-pointer"
            >
              Sign In
            </div>
          </Show>
        </div>
      </div>
    </>
  )
}
