import { For, Show, createEffect, createSignal, untrack } from "solid-js"
import { useNavigate } from "solid-start"
import { createShortcut } from "@solid-primitives/keyboard"

export default function TopicNav() {
  const [showInput, setShowInput] = createSignal(false)
  const navigate = useNavigate()

  // TODO: add fuzzy searching for topics. also consider lower case inputs matching results too
  const [topics, setTopics] = createSignal([
    "NLP",
    "Chemistry",
    "Physics",
    "Nature",
    "Math",
  ])
  const [topicSearchResults, setTopicSearchResults] = createSignal<string[]>([])
  const [topicSearchInput, setTopicSearchInput] = createSignal("")
  const [focusedTopic, setFocusedTopic] = createSignal(0)
  const [focusedTodoTitle, setFocusedTodoTitle] = createSignal("")

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
        setTopicSearchResults(topics())
        setTopicSearchResults(
          topicSearchResults().filter((word: string) =>
            topicSearchInput()
              .split("")
              .every((value) => {
                return word.split("").includes(value)
              }),
          ),
        )
      })
      setFocusedTodoTitle(topicSearchResults()[focusedTopic()])
    }
  })
  return (
    <>
      <style>
        {`
      #InputMinimised {
        width: 212px;
      }
      #InputExpanded {
        width: 500px;
      }
       #Focused {
      background-color: rgba(124,124,124,0.4);

    }
    #UnFocused {
      background-color: transparent;
    }
      `}
      </style>
      <div class="flex flex-col">
        <div class="h-[80px] w-full p-4 flex items-center justify-between border-b border-[#69696951]">
          <div class="flex gap-4 h-full items-center">
            <div class="w-[40px] h-[40px] bg-neutral-200 rounded-full">
              <div
                class="cursor-pointer"
                onClick={() => {
                  navigate("/")
                }}
              >
                <img src="/logo.jpg" alt="" />
              </div>
            </div>
            <div
              onClick={() => {
                setShowInput(true)
              }}
              id={showInput() ? "InputExpanded" : "InputMinimised"}
              class="bg-neutral-200 rounded-[4px] transition-all h-full flex items-center text-[#696969] font-light"
            >
              <Show
                when={showInput()}
                fallback={<div class="p-[12px]">Search Topic</div>}
              >
                <div class="relative w-full p-[12px]">
                  <div class="flex items-center">
                    <input
                      type="text"
                      class="w-full bg-transparent outline-none"
                      placeholder="Search Topic"
                      onInput={(e) => {
                        setTopicSearchInput(e.target.value)
                      }}
                    />
                  </div>
                  <Show
                    when={
                      topicSearchInput() !== "" &&
                      topicSearchResults().length !== 0
                    }
                  >
                    <div class=" absolute top-[54px] bg-neutral-200 left-0 text-black font-semibold text-opacity-40 flex flex-col rounded w-full">
                      <For each={topicSearchResults()}>
                        {(topic) => (
                          <div
                            id={
                              focusedTodoTitle() === topic
                                ? "Focused"
                                : "UnFocused"
                            }
                            onClick={() => {
                              setFocusedTopic(
                                topicSearchResults().indexOf(topic),
                              )
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
              </Show>
            </div>
          </div>
          <div class="flex items-center justify-center gap-4">
            {/* TODO:  */}
            {/* <div>Dark/Light switch</div> */}
            <div
              class="text-black cursor-pointer font-medium"
              onClick={() => {
                navigate("/about")
              }}
            >
              About
            </div>
            <a
              class="text-black font-medium"
              href="https://github.com/learn-anything/learn-anything.xyz"
            >
              GitHub
            </a>
            <div
              onClick={() => {
                navigate("/auth")
              }}
              class="bg-[#3B5CCC] leading-[23.48px] w-[91px] text-white h-[39px] flex items-center justify-center font-light text-[20px] px-4 p-2 rounded-full cursor-pointer"
            >
              Log In
            </div>
            {/* TODO:  */}
            {/* <div>Menu</div> */}
          </div>
        </div>
        <div class="flex items-center font-light text-[14px] px-2 h-[30px] w-full bg-[#f5f5f5] text-[#696969]">
          Art / Physics
        </div>
      </div>
    </>
  )
}
