import { autofocus } from "@solid-primitives/autofocus"
import clsx from "clsx"
import { div } from "edgedb/dist/primitives/bigint"
import Fuse from "fuse.js"
import { For, Show, batch, createMemo, createSignal } from "solid-js"

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
  const [searchResults, setSearchResults] = createSignal(props.searchResults)
  const [query, setQuery] = createSignal("")

  const fuse = createMemo(
    () =>
      new Fuse(searchResults(), {
        keys: ["name"],
        shouldSort: false,
      }),
  )

  const results = createMemo(() => {
    const results = fuse()
      .search(query())
      .map((r) => r.item.name)

    const [selected, setSelected] = createSignal<string>(results[0])

    return {
      results,
      selected,
      setSelected,
    }
  })

  // TODO: uncommented because wrapIndex was not defined, get it from kuskus
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

  // TODO: show results too, not just input
  return (
    <>
      <style>
        {`

      `}
      </style>
      <div class="relative w-full h-full">
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
                  batch(() => {
                    {
                      /* TODO: not sure what should go here */
                    }
                    {
                      /* todoList.setFocusedTodoKey(selected)
            todoList.setMode(TodoListMode.Default) */
                    }
                  })
                }
              }}
              oninput={(e) => setQuery(e.target.value)}
              autofocus
              ref={(el) => autofocus(el)}
              type="text"
              placeholder={props.placeholder}
            />
            <Show when={query() !== ""}>
              <div class="flex flex-col w-full p-1">
                <For each={searchResults()}>
                  {(topic) => {
                    return (
                      <div class="w-full px-3 p-2 rounded-[6px] hover:bg-neutral-100">
                        {topic.name}
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
