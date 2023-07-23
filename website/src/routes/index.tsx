import { createShortcut } from "@solid-primitives/keyboard"
import { For, Show, createEffect, createSignal, untrack } from "solid-js"
import { useNavigate } from "solid-start"

export default function Home() {
  const navigate = useNavigate()
  const [TopicArray, setTopicArray] = createSignal([
    "nlp",
    "chemistry",
    "physics",
    "physics 2",
  ])
  const [filteredTopic, setFilteredTopic] = createSignal([])
  const [filteredWord, setFilteredWord] = createSignal("")
  const [focusedTopic, setFocusedTopic] = createSignal(0)
  const [focusedTodoTitle, setFocusedTodoTitle] = createSignal("")

  createShortcut(["ARROWDOWN"], () => {
    if (focusedTopic() === filteredTopic().length - 1) {
      setFocusedTopic(0)
      return
    }
    setFocusedTopic(focusedTopic() + 1)
  })
  createShortcut(["ARROWUP"], () => {
    if (focusedTopic() === 0) {
      setFocusedTopic(filteredTopic().length - 1)
      return
    }
    setFocusedTopic(focusedTopic() - 1)
  })

  createEffect(() => {
    if (filteredWord()) {
      untrack(() => {
        setFilteredTopic(TopicArray())
        setFilteredTopic(
          filteredTopic().filter((word: any) =>
            filteredWord()
              .split("")
              .every((v) => {
                return word.split("").includes(v)
              })
          )
        )

        console.log(filteredTopic())
      })
      setFocusedTodoTitle(filteredTopic()[focusedTopic()])
    }
  })

  return (
    <>
      <style>
        {`
    #Focused {
      background-color: rgba(124,124,124,0.4);

    }
    #UnFocused {
      background-color: transparent;
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
        <div class="w-screen bg-neutral-950 text-white h-screen flex items-center justify-center">
          <div class="flex flex-col gap-1 items-center justify-center">
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
                  setFilteredWord(e.target.value)
                }}
                class=" rounded text-lg font-semibold py-2 px-4 outline-none text-black"
                style={{ width: "100%" }}
              />
              <Show
                when={filteredWord() !== "" && filteredTopic().length !== 0}
              >
                <div class="bg-white absolute top-12 left-0 text-black font-semibold text-opacity-40 flex flex-col rounded w-full">
                  <For each={filteredTopic()}>
                    {(topic) => (
                      <div
                        id={
                          focusedTodoTitle() === topic ? "Focused" : "UnFocused"
                        }
                        onClick={() => {
                          setFocusedTopic(filteredTopic().indexOf(topic))
                        }}
                        class="px-4 overflow-auto py-2"
                      >
                        <div>{topic}</div>
                      </div>
                    )}
                  </For>
                </div>
              </Show>
            </div>
          </div>
          <div
            onClick={() => {
              navigate("/auth")
            }}
            class="absolute top-5 right-5 hover:text-green-400 font-bold text-lg transition-all cursor-pointer"
          >
            Sign In
          </div>
        </div>
        <div class="w-screen h-screen flex items-center justify-center bg-neutral-950">
          <div
            id="RotatePlanet"
            class="relative border-slate-400 border-opacity-50 border-2 rounded-full p-16"
          >
            <div class="absolute top-14 left-12 bg-white p-8 rounded-full"></div>
            <div
              id="RotatePlanet2"
              class="relative border-slate-400 border-opacity-50 border-2 rounded-full p-16"
            >
              <div class="absolute bottom-10 right-12 bg-white p-6 rounded-full"></div>
              <div
                id="RotatePlanet3"
                class="relative border-slate-400 border-opacity-50 border-2 rounded-full p-16"
              >
                <div class="absolute top-7 right-7 bg-white p-5 rounded-full"></div>
                <div class="bg-white flex items-center justify-center h-48 w-48 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
