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
      const res = await fetch(`http://127.0.0.1:3000/topic`)
      const jsonResponse = await res.json()
      console.log(jsonResponse)
      const content = jsonResponse.content
      if (content) {
        return content
      }
      return ""
    }
  )

  const [sidebarTopics] = createResource(
    () => params.topic,
    async () => {
      const res = await fetch(`http://127.0.0.1:3000/sidebar`)
      const sidebarTopics = await res.json()
      return sidebarTopics
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
      #FixedSidebar {
        width: 45%;
      }
      #PhoneBlur {
        display: block;
      }
      @media (min-width: 800px) {
       #Sidebar {
        display: block;
       }
       #FixedSidebar {
        width: 20%;
       }
       #PhoneBlur {
        display: none;
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

        <Show when={true}>
          <div
            style={{
              "min-width": "250px",
            }}
            class=" h-full z-50 "
            id="FixedSidebar"
          >
            {/* <Sidebar sidebar={sidebar()} /> */}
          </div>
          <div
            id="PhoneBlur"
            class="fixed top-0 right-0 h-full w-full bg-black bg-opacity-60 z-40"
            onClick={() => {
              setShowSidebar(false)
            }}
          ></div>
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
