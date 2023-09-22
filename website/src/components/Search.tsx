import clsx from "clsx"
import Fuse from "fuse.js"
import * as solid from "solid-js"
import { createEventListener } from "@solid-primitives/event-listener"
import { Num } from "@nothing-but/utils"

/*
TODO: make component work logically
and make it look as in https://lu.ma/create `Add Event Location` visually
to be used in landing page and all across LA
replace the mess search that is inside routes/index (landing page) with this component
search should be fuzzy too + case insensitive, but I think fuse lib takes care of that
you should be able to click on the results too to trigger the action
*/

export type SearchResult = {
  name: string
  action: () => void
}

export interface SearchState {
  get results(): SearchResult[]
  get query(): string
  setQuery: (query: string) => void
  get searchOpen(): boolean
  setSearchOpen: (focused: boolean) => void
  get focused(): SearchResult | undefined
  setFocused: (item: SearchResult | undefined) => void
}

const FUSE_OPTIONS: Fuse.IFuseOptions<SearchResult> = {
  keys: ["name"],
  shouldSort: false,
}

export function createSearchState(
  searchResults: solid.Accessor<SearchResult[]>,
): SearchState {
  const [query, setQuery] = solid.createSignal("")
  const [searchOpen, setSearchOpen] = solid.createSignal(false)

  const fuse = solid.createMemo(() => new Fuse(searchResults(), FUSE_OPTIONS))

  interface ResultsMemo {
    results: SearchResult[]
    focused: solid.Accessor<SearchResult | undefined>
    setFocused: solid.Setter<SearchResult | undefined>
  }

  const results = solid.createMemo<ResultsMemo>((prev) => {
    const results = query()
      ? fuse()
          .search(query())
          .map((r) => r.item)
      : searchResults()

    let init_focused: SearchResult | undefined
    if (prev) {
      const prev_focused = solid.untrack(prev.focused)
      if (prev_focused && results.includes(prev_focused)) {
        init_focused = prev_focused
      }
    }

    const [focused, setFocused] = solid.createSignal(init_focused)

    return {
      results,
      focused,
      setFocused,
    }
  })

  return {
    get results() {
      return results().results
    },
    get query() {
      return query()
    },
    setQuery,
    get searchOpen() {
      return searchOpen()
    },
    setSearchOpen,
    get focused() {
      return results().focused()
    },
    setFocused(item) {
      solid.untrack(results).setFocused(item)
    },
  }
}

export function selectSearchResult(
  search: SearchState,
  result: SearchResult,
): void {
  solid.batch(() => {
    search.setFocused(undefined)
    search.setSearchOpen(false)
    result.action()
  })
}

export interface SearchProps {
  placeholder: string
  state: SearchState
}

export function Search(props: SearchProps): solid.JSX.Element {
  const focusedIndex = solid.createMemo(() =>
    props.state.focused ? props.state.results.indexOf(props.state.focused) : -1,
  )

  return (
    <div
      class="bg-white dark:bg-neutral-900 absolute top-0 right-0 w-full flex flex-col border-slate-400 dark:border-opacity-30 border rounded-[4px]"
      ref={(container) => {
        /*
            if the click is outside the container, close the search
          */
        createEventListener(document, "click", (e) => {
          if (!(e.target instanceof Node) || !container.contains(e.target)) {
            solid.batch(() => {
              props.state.setFocused(undefined)
              props.state.setSearchOpen(false)
            })
          }
        })
      }}
    >
      <input
        class={clsx(
          "w-full bg-transparent p-3 px-4 text-black dark:text-white text-opacity-70 h-full outline-none",
          props.state.searchOpen &&
            "border-b h-full border-slate-400 dark:border-opacity-30",
        )}
        on:keydown={(e) => {
          if (e.isComposing || e.defaultPrevented) return

          switch (e.key) {
            case "ArrowDown":
            case "ArrowUp": {
              e.preventDefault()

              const isDown = e.key === "ArrowDown"
              const d = isDown ? 1 : -1
              const len = props.state.results.length
              const idx = focusedIndex()
              const new_idx =
                idx === -1 ? (isDown ? 0 : len - 1) : Num.wrap(idx + d, 0, len)

              solid.batch(() => {
                props.state.setSearchOpen(true)
                props.state.setFocused(props.state.results[new_idx])
              })

              break
            }
            case "Enter":
            case "Tab": {
              const focused = props.state.focused
              if (!props.state.searchOpen || !focused) return

              e.preventDefault()
              selectSearchResult(props.state, focused)

              break
            }
          }
        }}
        onInput={(e) => props.state.setQuery(e.target.value)}
        onPaste={(e) => props.state.setQuery(e.currentTarget.value)}
        type="text"
        placeholder={props.placeholder}
        onClick={() => props.state.setSearchOpen(true)}
      />
      <solid.Show when={props.state.searchOpen}>
        <div>
          <solid.For each={props.state.results}>
            {(topic) => (
              <div
                class={clsx(
                  "w-full px-3 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-white text-black border-y border-slate-400 dark:border-neutral-800",
                  props.state.focused === topic &&
                    "bg-gray-100 dark:bg-neutral-800 dark:border-opacity-30 drop-shadow-md",
                )}
                onClick={() => selectSearchResult(props.state, topic)}
              >
                {topic.name}
              </div>
            )}
          </solid.For>
        </div>
      </solid.Show>
    </div>
  )
}
