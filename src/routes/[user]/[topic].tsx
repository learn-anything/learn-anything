import { Show, createResource } from "solid-js"
import { useParams } from "solid-start"
import Sidebar from "~/components/Sidebar"
import TopicContent from "~/components/TopicContent"

export default function Topic() {
  const params = useParams()

  // content as markdown
  const [content] = createResource(
    () => params.topic,
    async () => {
      const res = await fetch(`http://127.0.0.1:3000/users/1/${params.topic}`)
      console.log(res)
      const jsonResponse = await res.json()
      const content = jsonResponse.content
      if (content) {
        return content
      }
      return ""
    }
  )

  return (
    <>
      <style>
        {`
        #Sidebar {
          background-color: #f6f6f7
        }
      @media (prefers-color-scheme: dark) {
        #Sidebar {
          background-color: #161618ab
        }

      }
      `}
      </style>
      <main
        id="main"
        class="flex w-screen h-screen"
        style={{ "font-family": "Inter" }}
      >
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
        <div class="h-screen" style={{ "min-width": "15%" }}></div>
        <div
          style={{
            width: "20%",

            "min-width": "250px",
          }}
          class=" h-full z-50 fixed top-0 left-0"
          id="Sidebar"
        >
          <Sidebar />
        </div>

        <div style={{ width: "100%" }} class=" h-full">
          <Show when={content()}>
            <TopicContent content={content()} />
          </Show>
        </div>
      </main>
    </>
  )
}
