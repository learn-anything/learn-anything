import { createShortcut } from "@solid-primitives/keyboard"
import { For, Show, createEffect, createSignal, untrack } from "solid-js"

export default function Home() {
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
    `}
      </style>
      <div class="w-screen bg-neutral-950 text-white h-screen flex items-center justify-center">
        <div class="flex flex-col gap-5 items-center justify-center">
          <div class="text-5xl font-bold">I want to learn</div>
          <div class="w-full relative flex flex-col gap-3">
            <input
              type="text"
              placeholder="Search"
              onInput={(e) => {
                setFilteredWord(e.target.value)
              }}
              class=" rounded font-semibold py-2 px-4 outline-none text-black"
              style={{ width: "450px" }}
            />
            <Show when={filteredWord() !== "" && filteredTopic().length !== 0}>
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
        <div class="absolute top-5 right-5 hover:text-green-400 font-bold text-lg transition-all cursor-pointer">
          Sign In
        </div>
      </div>
    </>
  )
}
