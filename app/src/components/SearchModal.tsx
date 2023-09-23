import createFuzzySearch from "@nozbe/microfuzz"
import { For, Show, createMemo, createSignal } from "solid-js"
import { useUser } from "../GlobalContext/user"
import { autofocus } from "@solid-primitives/autofocus"
import Modal from "./Modal"

interface Props {
  items: string[]
  action: () => void
  actionDocumentation?: string // on bottom of modal
  searchPlaceholder?: string
}

export default function SearchModal(props: Props) {
  const [searchQuery, setSearchQuery] = createSignal("")
  const [focusedItem, setFocusedItem] = createSignal(0)

  const user = useUser()

  const fuzzySearch = createMemo(() => {
    return createFuzzySearch(props.items)
  })

  const searchResults = createMemo(() => {
    if (!searchQuery()) {
      return props.items
    } else {
      console.log(fuzzySearch()(searchQuery()))
      return fuzzySearch()(searchQuery())
    }
  })

  // createShortcut(["ARROWDOWN"], () => {
  //   if (focusedItem()) {
  //   }
  //   if (focusedTopic() === filteredTopics().length - 1) {
  //     setFocusedTopic(0)
  //     return
  //   }
  //   setFocusedTopic(focusedTopic() + 1)
  // })

  // createShortcut(["ARROWUP"], () => {
  //   if (focusedTopic() === 0) {
  //     setFocusedTopic(filteredTopics().length - 1)
  //     return
  //   }
  //   setFocusedTopic(focusedTopic() - 1)
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
    `}
      </style>
      <Modal>
        <div id="ToolBar" class="w-4/6 h-1/2">
          <div class="w-full relative flex flex-col gap-3">
            <input
              ref={(el) => autofocus(el)}
              type="text"
              placeholder={
                props.searchPlaceholder ? props.searchPlaceholder : "Search"
              }
              autofocus
              onInput={(e) => {
                setSearchQuery(e.target.value)
              }}
              class=" rounded-md text-xl bg-white dark:bg-[#1e1e1e] border-slate-400 border-opacity-30 border font-semibold py-4 px-6 outline-none text-black dark:text-white"
              style={{ width: "100%" }}
            />
            <Show
              // when={filteredWords() !== "" && filteredTopics().length !== 0}
              when={true}
            >
              <div class="bg-white dark:bg-[#1e1e1e] overflow-auto h-80 border-slate-400 border-opacity-30 border  absolute top-16 left-0 text-white font-semibold text-opacity-40 flex flex-col rounded-lg p-2 w-full">
                <For each={searchResults()}>
                  {(item) => {
                    console.log(item)
                    return (
                      <div
                        onClick={() => {}}
                        class="text-black dark:text-white px-6 rounded-lg py-3"
                      >
                        <div>{typeof item === "string" ? item : item.item}</div>
                      </div>
                    )
                  }}
                </For>
              </div>
            </Show>
          </div>
        </div>
      </Modal>
    </>
  )
}
