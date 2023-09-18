import clsx from "clsx"
import Fuse from "fuse.js"
import {
  For,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onMount,
} from "solid-js"
import { makeEventListener } from "@solid-primitives/event-listener"
import { createShortcut, useKeyDownList } from "@solid-primitives/keyboard"
import { useNavigate } from "solid-start"

type SearchResult = {
  name: string
  action?: () => void
}

type Props = {
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

  const [focusedTopic, setFocusedTopic] = createSignal(0)
  const [focusedTopicTitle, setFocusedTopicTitle] = createSignal("")
  const navigate = useNavigate()
  const [toggleSearch, setToggleSearch] = createSignal(false)

  createShortcut(["ARROWDOWN"], () => {
    if (focusedTopic() === results().results.length - 1) {
      setFocusedTopic(0)
      return
    }
    setFocusedTopic(focusedTopic() + 1)
  })
  createShortcut(["ARROWUP"], () => {
    if (focusedTopic() === 0) {
      setFocusedTopic(results().results.length - 1)
      return
    }

    setFocusedTopic(focusedTopic() - 1)
  })
  createShortcut(["ENTER"], () => {
    navigate(`/${results().results[focusedTopic()]}`)
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
      () => {
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
    setFocusedTopicTitle(results().results[focusedTopic()])
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

  return (
    <>
      <style>
        {`
      `}
      </style>
      <div class="relative w-[500px] h-full">
        <div class="absolute w-full top-0 h-full left-0 z-10">
          <div class=" bg-white border border-slate-400 flex-col flex items-center justify-center rounded-[4px] min-h-full w-full">
            <input
              style={{ outline: "none" }}
              class={clsx(
                "w-full bg-transparent p-4  h-full",
                query() !== undefined && "border-b border-slate-400",
              )}
              onKeyPress={(e) => {
                const selected = results().selected()
                if (e.key === "Enter" && selected) {
                  console.log("selected result: ")
                }
              }}
              oninput={(e) => setQuery(e.target.value)}
              type="text"
              ref={ref}
              placeholder={props.placeholder}
            />
            <Show when={inputFocused()}>
              <div class="flex flex-col w-full">
                <For each={results().results}>
                  {(topic) => {
                    return (
                      <div
                        class={clsx(
                          "w-full px-3 p-2 rounded-[6px] hover:bg-neutral-100",
                          focusedTopicTitle() === topic && "bg-neutral-100",
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
      </div>
    </>
  )
}
