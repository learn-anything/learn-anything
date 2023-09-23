import { Show, createResource } from "solid-js"
import { useNavigate } from "solid-start"
import { getHankoCookie } from "../../lib/auth"
import { Search, SearchResult, createSearchState } from "../components/Search"
import { ForceGraph } from "../components/force-graph"

// TODO: load the graph with graph data from server (no undefined flying around)
export default function Home() {
  const navigate = useNavigate()

  const [hankoCookie] = createResource(() => {
    const hankoCookie = getHankoCookie()
    return hankoCookie
  })

  const searchResults: SearchResult[] = [
    {
      name: "3d printing",
      action: () => {
        navigate(`/3d-printing`)
      },
    },
    {
      name: "Physics",
      action: () => {
        navigate(`/Physics`)
      },
    },
    {
      name: "Math",
      action: () => {
        navigate(`/Math`)
      },
    },
  ]
  const search_state = createSearchState(() => searchResults)

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
        <ForceGraph />
        <div class="flex flex-col gap-1 items-center z-50">
          <div
            class="tracking-wide font-bold bg-clip-text text-transparent"
            style={{
              "background-image":
                "linear-gradient(145deg, #fff 65%, rgba(255,255,255,.43))",
              "font-size": "clamp(3rem, 10vw, 5rem)",
            }}
          >
            I want to learn
          </div>
          <div
            class="relative w-[50%] h-full flex items-center transition-all duration-150"
            classList={{
              "w-[70%]": search_state.searchOpen,
            }}
          >
            <Search placeholder="Search Topic" state={search_state} />
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
