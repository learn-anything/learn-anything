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
      <div
        class={clsx(
          "relative w-[50%] h-full flex items-center transition-all duration-150",
          inputFocused() && "w-full",
        )}
      >
        <div class="bg-white absolute top-0 right-0 w-full flex flex-col border-slate-400 border rounded-[4px]">
          <input
            style={{ outline: "none" }}
            class={clsx(
              "w-full bg-transparent p-3 px-4 text-black text-opacity-70 h-full",
              inputFocused() && "border-b h-full border-slate-400",
            )}
            onKeyPress={(e) => {
              const selected = results().selected()
              if (e.key === "Enter" && selected) {
                console.log("selected result: ")
              }
            }}
            onClick={() => {
              setToggleSearch(true)
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
                        "w-full px-3 p-2 hover:bg-neutral-100",
                        focusedTopicTitle() === topic &&
                          "bg-gray-100 border-y border-slate-400 drop-shadow-md",
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
    </>
  )
}
