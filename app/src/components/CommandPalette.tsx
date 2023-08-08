import { createShortcut } from "@solid-primitives/keyboard"
import {
  For,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onMount,
  untrack,
} from "solid-js"
import { useUser } from "../GlobalContext/user"
import { useWiki } from "../GlobalContext/wiki"

// TODO: use https://github.com/Nozbe/microfuzz for fuzzy search
export default function CommandPalette() {
  const wiki = useWiki()
  const user = useUser()
  // const [filteredTopics, setFilteredTopics] = createSignal([])
  // const [filteredWords, setFilteredWords] = createSignal("")
  const [focusedTopic, setFocusedTopic] = createSignal(0)
  const [focusedTodoTitle, setFocusedTodoTitle] = createSignal("")

  onMount(() => {})

  const topics = createMemo(() => {
    return wiki.wiki.sidebarTopics
  })

  // createEffect(() => {
  //   if (filteredWords()) {
  //     untrack(() => {
  //       console.log(topics(), "sidebar topics")
  //       setFilteredTopics(topics())

  //       setFilteredTopics(
  //         filteredTopics().filter((word: any) =>
  //           filteredWords()
  //             .split("")
  //             .every((v) => {
  //               return word.prettyName.split("").includes(v)
  //             }),
  //         ),
  //       )
  //     })
  //     setFocusedTodoTitle(filteredTopics()[focusedTopic()])
  //   }
  // })

  return (
    <>
      <style>
        {`
        #ToolBar {
          animation: 0.1s scaleToolBar forwards linear
        }
        @keyframes scaleToolBar {
          0% {
            transform: scale(0.7);
            opacity: 0
          }
          100% {
            transform: scale(1);
            opacity: 1
          }
        }
        #ToolBarBackDrop {
          animation: 0.1s ToolBarBackDropOpacity forwards linear
        }
        @keyframes  ToolBarBackDropOpacity {
          0% {
            opacity: 0
          }
          100% {
            opacity: 1
          }
        }
        #Focused {
          background-color: rgba(40, 40, 40, 0.7);

        }
        #UnFocused {
          background-color: inherit;
        }
      `}
      </style>
      <div class="absolute top-0 right-0 w-full h-full">
        <div
          onClick={() => {
            user.setShowCommandPalette(false)
          }}
          id="ToolBarBackDrop"
          class="absolute top-0 right-0 bg-neutral-900 bg-opacity-50 h-full w-full"
        ></div>
        <div id="ToolBar" class=" flex h-1/3 justify-center items-center">
          <div class="w-1/2  relative flex flex-col gap-3">
            <input
              type="text"
              placeholder="Search"
              onInput={(e) => {
                // setFilteredWords(e.target.value)
              }}
              class=" rounded-md text-xl bg-[#1e1e1e] border-slate-400 border-opacity-30 border font-semibold py-4 px-6 outline-none text-black dark:text-white"
              style={{ width: "100%" }}
            />
            <Show
              // when={filteredWords() !== "" && filteredTopics().length !== 0}
              when={true}
            >
              <div class="bg-[#1e1e1e] border-slate-400 border-opacity-30 border  absolute top-16 left-0 text-white font-semibold text-opacity-40 flex flex-col rounded-lg p-2 w-full">
                {/* <For each={filteredTopics()}>
                  {(topic) => (
                    <div
                      id={
                        focusedTodoTitle() === topic ? "Focused" : "UnFocused"
                      }
                      onClick={() => {
                        setFocusedTopic(filteredTopics().indexOf(topic))
                      }}
                      class="px-6 rounded-lg overflow-auto py-3"
                    >
                      <div>{topic.prettyName}</div>
                    </div>
                  )}
                </For> */}
              </div>
            </Show>
          </div>
        </div>
      </div>
    </>
  )
}
