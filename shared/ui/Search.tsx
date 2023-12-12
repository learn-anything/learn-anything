import { Num } from "@nothing-but/utils"
import { createEventListener } from "@solid-primitives/event-listener"

import clsx from "clsx"
import * as fuse from "fuse.js"
import * as solid from "solid-js"
import { onMount } from "solid-js"

/*
TODO: make it look as in https://lu.ma/create `Add Event Location` visually (although it does look nice already)
TODO: replace fuse.js with https://oramasearch.com (maybe, so far Fuse is doing good job)
*/

export type SearchResult = { name: string }

export type OnSearchResultSelect = (result: SearchResult) => void

export type SearchStateOptions = {
  searchResults: solid.Accessor<SearchResult[]>
  onSelect: OnSearchResultSelect
}

export interface SearchState {
  get results(): SearchResult[]
  get query(): string
  setQuery: (query: string) => void
  get searchOpen(): boolean
  setSearchOpen: (focused: boolean) => void
  get focused(): SearchResult | undefined
  setFocused: (item: SearchResult | undefined) => void
  onSelect: OnSearchResultSelect
}

const defaultSearchResult: SearchResult = { name: "Default" }
function getRandomSubarray(arr: SearchResult[], size: number): SearchResult[] {
  const shuffled = arr.slice(0)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const itemI = shuffled[i] || defaultSearchResult
    const itemJ = shuffled[j] || defaultSearchResult
    ;[shuffled[i], shuffled[j]] = [itemJ, itemI]
  }
  return shuffled.slice(0, size)
}

const FUSE_OPTIONS: fuse.IFuseOptions<SearchResult> = {
  keys: ["name"]
}
const SEARCH_RESULTS_LIMIT = 5
const FUSE_SEARCH_OPTIONS: fuse.FuseSearchOptions = {
  limit: SEARCH_RESULTS_LIMIT
}

export function createSearchState({
  onSelect,
  searchResults
}: SearchStateOptions): SearchState {
  const [query, setQuery] = solid.createSignal("")
  const [searchOpen, setSearchOpen] = solid.createSignal(false)

  const fuseInstance = solid.createMemo(
    () => new fuse.default(searchResults(), FUSE_OPTIONS)
  )

  interface ResultsMemo {
    results: SearchResult[]
    focused: solid.Accessor<SearchResult | undefined>
    setFocused: solid.Setter<SearchResult | undefined>
  }

  const results = solid.createMemo<ResultsMemo>((prev) => {
    const _results = query()
      ? fuseInstance()
          .search(query(), FUSE_SEARCH_OPTIONS)
          .map((r) => r.item)
      : getRandomSubarray(searchResults(), SEARCH_RESULTS_LIMIT)

    /*
      try reusing the previously focused item
      otherwise, focus the first result
    */
    let init_focused = prev && solid.untrack(prev.focused)
    if (!init_focused || !_results.includes(init_focused)) {
      init_focused = _results[0]
    }

    const [focused, setFocused] = solid.createSignal(init_focused)

    return {
      results: _results,
      focused,
      setFocused
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
    onSelect
  }
}

export function closeSearch(search: SearchState): void {
  solid.batch(() => {
    search.setFocused(undefined)
    search.setSearchOpen(false)
  })
}

export function selectSearchResult(
  search: SearchState,
  result: SearchResult
): void {
  solid.batch(() => {
    search.setFocused(undefined)
    search.setSearchOpen(false)
    search.onSelect(result)
  })
}

export function updateQuery(search: SearchState, query: string): void {
  solid.batch(() => {
    search.setQuery(query)
    search.setSearchOpen(true)
  })
}

function handleInputKeydown(
  e: KeyboardEvent,
  input: HTMLInputElement,
  state: SearchState
): void {
  if (e.isComposing || e.defaultPrevented) return

  switch (e.key) {
    case "ArrowDown":
    case "ArrowUp": {
      e.preventDefault()

      /*
        move focus up/down
        or focus the first/last result if there's no focus
      */
      const isDown = e.key === "ArrowDown"
      const d = isDown ? 1 : -1
      const len = state.results.length
      const idx = state.focused ? state.results.indexOf(state.focused) : -1
      const new_idx =
        idx === -1 ? (isDown ? 0 : len - 1) : Num.wrap(idx + d, 0, len)

      solid.batch(() => {
        state.setSearchOpen(true)
        state.setFocused(state.results[new_idx])
      })

      break
    }
    case "Enter":
    case "Tab": {
      const focused = state.focused
      if (!state.searchOpen || !focused) return

      e.preventDefault()
      selectSearchResult(state, focused)
      state.setQuery("")

      break
    }
    case "Escape": {
      /*
        close results -> clear query -> blur input
      */
      if (state.searchOpen) {
        closeSearch(state)
      } else if (state.query) {
        state.setQuery("")
      } else {
        input.blur()
      }

      break
    }
    case "Backspace": {
      state.query || closeSearch(state)
    }
  }
}

export interface SearchProps {
  placeholder: string
  state: SearchState
}

export function Search(props: SearchProps): solid.JSX.Element {
  onMount(() => {
    document.getElementById("SearchInput")?.focus()
  })
  return (
    <div
      class="relative w-full bg-white rounded-[4px] dark:bg-neutral-900 text-black dark:text-white"
      ref={(el) => {
        /*
          if the click is outside the container, close the search
        */
        createEventListener(document, "click", (e) => {
          if (!(e.target instanceof Node) || !el.contains(e.target)) {
            closeSearch(props.state)
          }
        })
      }}
    >
      <div class="w-full mb-1">
        <input
          type="text"
          id="SearchInput"
          autofocus={true}
          placeholder={props.placeholder}
          class="w-full p-3 px-4 dark:bg-[#191919] bg-white rounded-[4px]  text-opacity-70 outline-none border dark:border-[#2f2f2f]"
          on:keydown={(e) =>
            handleInputKeydown(e, e.currentTarget, props.state)
          }
          value={props.state.query}
          onInput={(e) => updateQuery(props.state, e.currentTarget.value)}
          onPaste={(e) => updateQuery(props.state, e.currentTarget.value)}
          onClick={() => props.state.setSearchOpen(true)}
        />
      </div>
      <solid.Show when={props.state.searchOpen}>
        {(_) => (
          <div class="absolute w-full z-50 bg-white dark:bg-[#191919] dark:border-[#2f2f2f]  border rounded-[4px]">
            <solid.For each={props.state.results}>
              {(topic) => (
                <div
                  class={clsx(
                    "cursor-pointer w-full h-10 px-3 p-2 overflow-hidden hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-white text-black border-b dark:border-[#2f2f2f]",
                    props.state.focused === topic &&
                      "bg-neutral-200 dark:bg-neutral-800  drop-shadow-md",
                    topic ===
                      props.state.results[props.state.results.length - 1] &&
                      "border-none"
                  )}
                  onClick={() => {
                    selectSearchResult(props.state, topic)
                  }}
                >
                  {topic.name}
                </div>
              )}
            </solid.For>
          </div>
        )}
      </solid.Show>
    </div>
  )
}
