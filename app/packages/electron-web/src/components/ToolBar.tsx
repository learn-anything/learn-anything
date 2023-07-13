import { For, Show, createEffect, createSignal, untrack } from "solid-js"

export default function ToolBar(props: any) {
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

  // createShortcut(["ARROWDOWN"], () => {
  //   if (focusedTopic() === filteredTopic().length - 1) {
  //     setFocusedTopic(0)
  //     return
  //   }
  //   setFocusedTopic(focusedTopic() + 1)
  // })
  // createShortcut(["ARROWUP"], () => {
  //   if (focusedTopic() === 0) {
  //     setFocusedTopic(filteredTopic().length - 1)
  //     return
  //   }
  //   setFocusedTopic(focusedTopic() - 1)
  // })

  // createEffect(() => {
  //   if (filteredWord()) {
  //     untrack(() => {
  //       setFilteredTopic(TopicArray())

  //       setFilteredTopic(
  //         filteredTopic().filter((word: any) =>
  //           filteredWord()
  //             .split("")
  //             .every((v) => {
  //               return word.split("").includes(v)
  //             })
  //         )
  //       )

  //       console.log(filteredTopic())
  //     })
  //     setFocusedTodoTitle(filteredTopic()[focusedTopic()])
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
      `}
      </style>
      <div class="absolute top-0 right-0 w-full h-full">
        <div
          onClick={() => {
            props.setShowToolBar(false)
            console.log("run")
          }}
          id="ToolBarBackDrop"
          class="absolute top-0 right-0 bg-neutral-900 bg-opacity-50 h-full w-full"
        ></div>
        <div id="ToolBar" class=" flex h-1/3 justify-center items-center">
          <div class="w-1/2  relative flex flex-col gap-3">
            <input
              type="text"
              placeholder="Search"
              // onInput={(e) => {
              //   setFilteredWord(e.target.value)
              // }}
              class=" rounded-md text-xl font-semibold py-4 px-6 outline-none text-black dark:text-white"
              style={{ width: "100%" }}
            />
            {/* <Show when={filteredWord() !== "" && filteredTopic().length !== 0}> */}
            <Show when={false}>
              <div class="bg-neutral-700 absolute top-16 left-0 text-white font-semibold text-opacity-40 flex flex-col rounded-md w-full">
                {/* <For each={filteredTopic()}>
                  {(topic) => (
                    <div
                      id={
                        focusedTodoTitle() === topic ? "Focused" : "UnFocused"
                      }
                      onClick={() => {
                        setFocusedTopic(filteredTopic().indexOf(topic))
                      }}
                      class="px-6 overflow-auto py-3"
                    >
                      <div>{topic}</div>
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
