import clsx from "clsx"
import Fuse from "fuse.js"
import {
  For,
  Match,
  Show,
  Switch,
  createEffect,
  createMemo,
  createSignal,
  onMount,
  untrack,
} from "solid-js"
import { makeEventListener } from "@solid-primitives/event-listener"
import { createShortcut } from "@solid-primitives/keyboard"
import { useNavigate } from "solid-start"
import { input } from "edgedb/dist/adapter.node"

type SearchResult = {
  name: string
  action: () => void
}

type Props = {
  expandable: boolean
  placeholder: string
  searchResults: SearchResult[]
}

// TODO: make component work logically
// and make it look as in https://lu.ma/create `Add Event Location` visually
// to be used in landing page and all across LA
// replace the mess search that is inside routes/index (landing page) with this component
// search should be fuzzy too + case insensitive, but I think fuse lib takes care of that
// you should be able to click on the results too to trigger the action
export default function Search(props: Props) {
  const [query, setQuery] = createSignal("")
  const [inputFocused, setInputFocused] = createSignal(false)
  const [focusedItemIndex, setFocusedItemIndex] = createSignal(0)
  const [focusedItem, setFocusedItem] = createSignal("")

  // onMount(() => {
  //   console.log(props.searchResults[0])
  // })

  // const [focusedItem, setFocusedItem] = createSignal<{
  //   name: string
  //   index: number
  // }>({
  //   name: "",
  //   index: 0,
  // })

  const navigate = useNavigate()

  createShortcut(["ARROWDOWN"], () => {
    if (focusedItemIndex() === results().results.length - 1) {
      setFocusedItemIndex(0)
      return
    }
    setFocusedItemIndex(focusedItemIndex() + 1)
  })
  createShortcut(["ARROWUP"], () => {
    if (focusedItemIndex() === 0) {
      setFocusedItemIndex(results().results.length - 1)
      return
    }

    setFocusedItemIndex(focusedItemIndex() - 1)
  })
  createShortcut(["ENTER"], () => {
    if (inputFocused()) {
      props.searchResults[focusedItemIndex()].action()
    }
  })

  let ref!: HTMLInputElement
  onMount(() => {
    makeEventListener(
      ref,
      "focus",
      () => {
        setInputFocused(true)
      },
      { passive: true },
    )
    makeEventListener(
      ref,
      "blur",
      (e) => {
        console.log(e, "e")
        setInputFocused(false)
      },
      { passive: true },
    )
  })

  const fuse = createMemo(() => {
    return new Fuse(props.searchResults, {
      keys: ["name"],
      shouldSort: false,
    })
  })

  const results = createMemo(() => {
    let results
    if (query() === "") {
      results = props.searchResults.map((res) => res.name)
      const [selected, setSelected] = createSignal<string>(results[0])
      return {
        results,
        selected,
        setSelected,
      }
    }
    results = fuse()
      .search(query())
      .map((r) => r.item.name)

    const [selected, setSelected] = createSignal<string>(results[0])

    return {
      results,
      selected,
      setSelected,
    }
  })
  createEffect(() => {
    setFocusedItem(results().results[focusedItemIndex()])
  })
  // TODO: make up/down work
  // make pressing return on item works too
  // function selectNext(n: -1 | 1) {
  //   untrack(() => {
  //     const list = results().results
  //     const selected = results().selected()
  //     if (selected) {
  //       results().setSelected(
  //         list[wrapIndex(list.indexOf(selected) + n, list.length)]
  //       )
  //     }
  //   })
  // }
  // createShortcuts({
  //   // Focus on todo up from search results
  //   ArrowUp() {
  //     selectNext(-1)
  //   },
  //   // Focus on todo down from search results
  //   ArrowDown() {
  //     selectNext(1)
  //   },
  // })
  onMount(() => {})
  return (
    <>
      <style>
        {`
      `}
      </style>
      <Switch>
        <Match when={props.expandable}>
          <div
            class={clsx(
              "relative w-[50%] h-full flex items-center transition-all duration-150",
              inputFocused() && "w-full",
            )}
          >
            <div class="bg-white dark:bg-neutral-900 absolute top-0 right-0 w-full flex flex-col border-slate-400 dark:border-opacity-30 border rounded-[4px]">
              <input
                style={{ outline: "none" }}
                class={clsx(
                  "w-full bg-transparent p-3 px-4 text-black dark:text-white text-opacity-70 h-full",
                  inputFocused() &&
                    "border-b h-full border-slate-400 dark:border-opacity-30",
                )}
                onKeyPress={(e) => {
                  const selected = results().selected()
                  if (e.key === "Enter" && selected) {
                    // console.log("selected result: ")
                  }
                }}
                oninput={(e) => setQuery(e.target.value)}
                type="text"
                ref={ref}
                placeholder={props.placeholder}
              />
              <Show when={inputFocused()}>
                <div class="">
                  <For each={results().results}>
                    {(topic) => {
                      return (
                        <div
                          class={clsx(
                            "w-full px-3 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-white text-black",
                            focusedItem() === topic &&
                              "bg-gray-100 border-y border-slate-400 dark:bg-neutral-800 dark:border-opacity-30 drop-shadow-md",
                          )}
                          onClick={() => {
                            navigate(`/${topic}`)
                          }}
                        >
                          {topic}
                        </div>
                      )
                    }}
                  </For>
                </div>
              </Show>
            </div>
          </div>
        </Match>
        <Match when={!props.expandable}>
          <div class="relative dark:text-white text-black w-full h-full flex items-center transition-all duration-150">
            <div class="bg-white dark:bg-neutral-900 absolute top-0 right-0 w-full flex flex-col border-slate-400 dark:border-opacity-30 border rounded-[4px]">
              <input
                style={{ outline: "none" }}
                class={clsx(
                  "w-full bg-transparent p-3 px-4 text-black text-opacity-70 h-full dark:text-white",
                  inputFocused() &&
                    "border-b dark:border-opacity-30 h-full border-slate-400",
                )}
                onKeyPress={(e) => {
                  const selected = results().selected()
                  if (e.key === "Enter" && selected) {
                    console.log("selected result: ")
                  }
                }}
                onClick={() => {
                  {
                    /* setToggleSearch(true) */
                  }
                }}
                oninput={(e) => setQuery(e.target.value)}
                type="text"
                ref={ref}
                placeholder={props.placeholder}
              />
              <Show when={inputFocused()}>
                <div class="text-black dark:text-white">
                  <For each={results().results}>
                    {(result, id) => {
                      return (
                        <div
                          class={clsx(
                            "w-full px-3 p-2 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800",
                            focusedItem() === result &&
                              "bg-gray-100 dark:bg-neutral-800 border-y dark:border-opacity-30 border-slate-400 drop-shadow-md",
                            id() === 0 && "border-t-0",
                            id() === results().results.length - 1 &&
                              "border-b-0",
                          )}
                          onClick={() => {
                            setFocusedItemIndex(id())
                            props.searchResults[focusedItemIndex()].action()
                          }}
                        >
                          {result}
                        </div>
                      )
                    }}
                  </For>
                </div>
              </Show>
            </div>
          </div>
        </Match>
      </Switch>
    </>
  )
}
