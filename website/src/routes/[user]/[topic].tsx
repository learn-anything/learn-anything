import { Show, createResource, createSignal, onMount } from "solid-js"
import { useParams } from "solid-start"
import Sidebar from "~/components/Sidebar"
import { TopicPage } from "~/components/TopicPage"

export default function Topic() {
  const params = useParams()

  // topic's content/notes/links
  const [topic] = createResource(
    () => params.topic,
    async () => {
      console.log(params.topic, "topic")
      console.log(params.user, "user")
      const res = await fetch(`http://127.0.0.1:3000/topic`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: params.topic,
          user: params.user.replace("@", ""),
        }),
      })
      const topic = await res.json()
      console.log(topic, "topic")
      if (topic) {
        return topic
      }
      return null
    },
  )

  const [sidebarTopics] = createResource(
    () => params.topic,
    async () => {
      const res = await fetch(`http://127.0.0.1:3000/topic-sidebar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: params.user.replace("@", ""),
        }),
      })
      const sidebarTopics = await res.json()
      console.log(sidebarTopics, "sidebar topics")
      return sidebarTopics
    },
  )

  const [showSidebar, setShowSidebar] = createSignal(true)

  return (
    <>
      <style>
        {`
        #FixedSidebar {
          background-color: #f6f6f7
        }
      @media (prefers-color-scheme: dark) {
        #FixedSidebar {
          background-color: #161618
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
       @media (prefers-color-scheme: dark) {
        #FixedSidebar {
          background-color: #161618ab
        }
      }
       #FixedSidebar {
        width: 200px;
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

        <Show when={sidebarTopics() && showSidebar()}>
          <div
            style={{
              "min-width": "250px",
            }}
            class="fixed top-0 left-0 h-full z-50 "
            id="FixedSidebar"
          >
            <Sidebar sidebarTopics={sidebarTopics()} />
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
          <Show when={topic() && topic().content}>
            <TopicPage
              setShowSidebar={setShowSidebar}
              content={topic().content}
              notes={topic().notes}
              links={topic().links}
            />
          </Show>
        </div>
      </main>
    </>
  )
}
