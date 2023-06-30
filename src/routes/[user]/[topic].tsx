import { Show, createResource, createSignal } from "solid-js"
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

  const [sidebar] = createResource(
    () => params.topic,
    async () => {
      const res = await fetch(`http://127.0.0.1:3000/users/1/topics`)
      const jsonResponse = await res.json()
      console.log(jsonResponse, "topics")
      return jsonResponse
    }
  )

  const [showSidebar, setShowSidebar] = createSignal(false)

  return (
    <>
      <style>
        {`
        #FixedSidebar {
          background-color: #f6f6f7
        }
      @media (prefers-color-scheme: dark) {
        #FixedSidebar {
          background-color: #161618ab
        }

      }
      #Sidebar {
        display: none;
      }
      @media (min-width: 800px) {
       #Sidebar {
        display: block;
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
        <div class="h-screen" id="Sidebar" style={{ "min-width": "15%" }}></div>
        <Show when={showSidebar() && sidebar()}>
          <div
            style={{
              width: "20%",

              "min-width": "250px",
            }}
            class=" h-full z-50 fixed top-0 left-0"
            id="FixedSidebar"
          >
            <Sidebar sidebar={sidebar()} />
          </div>
        </Show>

        <div style={{ width: "100%" }} class=" h-full">
          <Show when={content()}>
            <TopicContent setShowSidebar={setShowSidebar} content={content()} />
          </Show>
        </div>
      </main>
    </>
  )
}
