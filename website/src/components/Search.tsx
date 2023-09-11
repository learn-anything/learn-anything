import { createSignal, For } from "solid-js"

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

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder={props.placeholder}
          onInput={(e) => {
            const value = (e.target as HTMLInputElement).value
            setSearchResults(
              props.searchResults.filter((result) =>
                result.name.toLowerCase().includes(value.toLowerCase()),
              ),
            )
          }}
        />
        <div>
          <For each={searchResults()}>
            {(result) => (
              <div>
                <div
                  onClick={() => {
                    console.log(result?.value)
                  }}
                >
                  {result.name}
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  )
}
