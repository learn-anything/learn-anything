import { Show } from "solid-js"
import createPersonalTopic, {
  PersonalTopicProvider
} from "../../../GlobalContext/personal-topic"
import { useMobius } from "../../../root"

export default function PersonalTopic() {
  const mobius = useMobius()
  const personalTopic = createPersonalTopic(mobius)

  return (
    <>
      <PersonalTopicProvider value={personalTopic}>
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

          {/* <Show when={sidebarTopics() && showSidebar()}> */}
          <Show when={true}>
            <div
              style={{
                "min-width": "250px"
              }}
              class="fixed top-0 left-0 h-full z-50 "
              id="FixedSidebar"
            >
              {/* <Sidebar sidebarTopics={sidebarTopics()} /> */}
            </div>
            <div
              id="PhoneBlur"
              class="fixed top-0 right-0 h-full w-full bg-black bg-opacity-60 z-40"
              onClick={() => {
                // setShowSidebar(false)
              }}
            ></div>
          </Show>

          <div style={{ width: "100%" }} class=" h-full">
            {/* <Show when={topic() && topic().content}> */}
            <Show when={true}>
              <div>{personalTopic.topic.content}</div>
              {/* <TopicPage
              // setShowSidebar={setShowSidebar}
              content={"# Hello"}
              notes={notes()}
              links={links()}
            /> */}
            </Show>
          </div>
        </main>
      </PersonalTopicProvider>
    </>
  )
}
