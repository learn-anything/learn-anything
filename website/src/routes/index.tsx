import { Show, createMemo, createResource } from "solid-js"
import { useNavigate } from "solid-start"
import { getHankoCookie } from "../../lib/auth"
import { useGlobalState } from "../GlobalContext/global.ts"
import { ui } from "@la/shared"
import { logUntracked } from "../lib/baselime"
import { getRandomItem } from "../lib/lib.ts"

export default function Home() {
  const navigate = useNavigate()
  const global = useGlobalState()

  const [hankoCookie] = createResource(() => {
    return getHankoCookie()
  })

  const searchPlaceholder = createMemo(() => {
    const item = getRandomItem(global.state.topicsWithConnections)
    if (item) return item.prettyName
  })

  const searchResults = createMemo(() => {
    return global.state.topicsWithConnections.map((t) => ({
      name: t.prettyName
    }))
  })

  const search_state = ui.createSearchState({
    searchResults,
    onSelect: ({ name }) => {
      const foundTopic = global.state.topicsWithConnections.find(
        (t) => t.prettyName === name
      )!
      navigate(`/${foundTopic.name}`)
      logUntracked("Topic searched", search_state.query)
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
        <ui.ForceGraph
          onNodeClick={(name) => {
            navigate(`/${name}`)
          }}
          filterQuery={() => search_state.query}
          raw_nodes={global.state.topicsWithConnections}
        />
        <div
          class="flex flex-col gap-1 items-center z-50"
          style={`
            filter: drop-shadow(2px 6px 126px rgb(10 10 10));
          `}
        >
          {/* shadow el */}
          <div
            class="absolute -z-1 inset-0 pointer-events-none rounded-full bg-neutral-950/90"
            style={`filter: blur(100px)`}
          />
          <div
            class="tracking-wide font-bold bg-clip-text "
            style={`
              font-size: clamp(3rem, 10vw, 5rem);
            `}
          >
            I want to learn
          </div>
          <div
            class="relative w-[70%]  h-full flex items-center transition-all duration-150"
            classList={{
              "w-[100%]": search_state.searchOpen
            }}
          >
            <ui.Search placeholder={searchPlaceholder()} state={search_state} />
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
