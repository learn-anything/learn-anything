import { Show, createMemo, createResource, createSignal } from "solid-js"
import { useNavigate } from "solid-start"
import { getHankoCookie } from "../../lib/auth"
import { useGlobalState } from "../GlobalContext/global.ts"
import { Search, createSearchState } from "../components/Search"
import { ForceGraph } from "../components/force-graph/index.tsx"
import { getRandomItem } from "../lib/lib.ts"

// TODO: load the graph with graph data from server (no undefined flying around)
export default function Home() {
  const navigate = useNavigate()
  const global = useGlobalState()
  const [suggestedTopicName, setSuggestedTopicName] = createSignal("")

  const [hankoCookie] = createResource(() => {
    const hankoCookie = getHankoCookie()
    return hankoCookie
  })

  const searchPlaceholder = createMemo(() => {
    const item = getRandomItem(global.state.topicsWithConnections)
    if (item) {
      setSuggestedTopicName(item.name)
      return item.prettyName
    }
  })

  const searchResults = createMemo(() => {
    return global.state.topicsWithConnections.map((t) => ({
      name: t.prettyName
    }))
  })

  const search_state = createSearchState({
    searchResults,
    onSelect: ({ name }) => {
      const foundTopic = global.state.topicsWithConnections.find(
        (t) => t.prettyName === name
      )!
      navigate(`/${foundTopic.name}`)
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
      <div
        class="w-screen h-screen
          flex flex-col items-center justify-center
          bg-neutral-950 text-white"
      >
        <ForceGraph
          onNodeClick={(name) => {
            navigate(`/${name}`)
          }}
        />
        <div class="flex flex-col gap-1 items-center z-50">
          <div class="tracking-wide font-bold bg-clip-text text-transparent">
            I want to learn
          </div>
          <div
            class="relative w-[50%] h-full flex items-center transition-all duration-150"
            classList={{
              "w-[70%]": search_state.searchOpen
            }}
          >
            <Search placeholder={searchPlaceholder()} state={search_state} />
          </div>
        </div>
        <Show when={!hankoCookie}>
          <button
            onClick={() => navigate("/auth")}
            class="absolute top-5 right-5 hover:text-green-400 font-bold text-lg transition-all cursor-pointer"
          >
            Sign In
          </button>
        </Show>
      </div>
    </>
  )
}
