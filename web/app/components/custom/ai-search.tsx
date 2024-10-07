import * as React from "react"
import * as smd from "streaming-markdown"

interface AiSearchProps {
  searchQuery: string
}

const AiSearch: React.FC<AiSearchProps> = (props: { searchQuery: string }) => {
  const [error, setError] = React.useState<string>("")

  const root_el = React.useRef<HTMLDivElement | null>(null)

  const [parser, md_el] = React.useMemo(() => {
    const md_el = document.createElement("div")
    const renderer = smd.default_renderer(md_el)
    const parser = smd.parser(renderer)
    return [parser, md_el]
  }, [])

  React.useEffect(() => {
    if (root_el.current) {
      root_el.current.appendChild(md_el)
    }
  }, [md_el])

  React.useEffect(() => {
    const question = props.searchQuery

    fetchData()
    async function fetchData() {
      let response: Response
      try {
        response = await fetch("/api/search-stream", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question: question }),
        })
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Error fetching data")
        return
      }

      if (!response.body) {
        console.error("Response has no body")
        setError("Response has no body")
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      let done = false
      while (!done) {
        const res = await reader.read()

        if (res.value) {
          const text = decoder.decode(res.value)
          smd.parser_write(parser, text)
        }

        if (res.done) {
          smd.parser_end(parser)
          done = true
        }
      }
    }
  }, [props.searchQuery, parser])

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center">
      <div className="w-full rounded-lg bg-inherit p-6 text-black dark:text-white">
        <div className="mb-6 rounded-lg bg-blue-700 p-4 text-white">
          <h2 className="text-lg font-medium">✨ This is what I have found:</h2>
        </div>
        <div
          className="rounded-xl bg-neutral-100 p-4 dark:bg-[#121212]"
          ref={root_el}
        ></div>
      </div>
      <p className="text-md pb-5 font-semibold opacity-50">{error}</p>
      <button className="text-md rounded-2xl bg-neutral-300 px-6 py-3 font-semibold text-opacity-50 shadow-inner shadow-neutral-400/50 transition-colors hover:bg-neutral-700 dark:bg-neutral-800 dark:shadow-neutral-700/50">
        Ask Community
      </button>
    </div>
  )
}

export default AiSearch
