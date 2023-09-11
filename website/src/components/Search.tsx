import { autofocus } from "@solid-primitives/autofocus"
import Fuse from "fuse.js"
import { batch, createMemo, createSignal } from "solid-js"

type SearchResult = {
  name: string
  value?: string
  action?: () => void
}

type Props = {
  placeholder: string
  searchResults: SearchResult[]
}

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

  return (
    <input
      style={{ outline: "none", height: "44px" }}
      class="w-full bg-transparent pl-2"
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
  )
}
