import { createShortcut } from "@solid-primitives/keyboard"
import { Show } from "solid-js"
import { UserProvider, createUserState } from "../GlobalContext/user"
import createWikiState, { WikiProvider } from "../GlobalContext/wiki"
import DevToolsPanel from "../components/DevToolsPanel"
import Editor from "../components/Editor"
import InputModal from "../components/InputModal"
import NoTopicChosen from "../components/NoTopicChosen"
import SearchModal from "../components/SearchModal"
import Settings from "../components/Settings"
import Sidebar from "../components/Sidebar"
import SignInPage from "../components/SignInPage"

export default function App() {
  const user = createUserState()
  const wiki = createWikiState()

  // TODO: Meta + L gives problems
  // does not trigger most of the time
  // so control + .. is used instead
  createShortcut(["Control", "L"], () => {
    if (user.user.mode === "Search Topics") {
      user.setMode("Default")
    } else {
      user.setMode("Search Topics")
    }
  })

  return (
    <>
      <style>
        {`
      `}
      </style>
      <UserProvider value={user}>
        <WikiProvider value={wiki}>
          <div
            style={{ width: "100vw", height: "100vh" }}
            class="flex items-center dark:bg-[#1e1e1e] bg-white"
          >
            <Show when={user.user.showSignIn}>
              {/* TODO: make a modal, pretty */}
              {/* TODO: try not to have 'pages', just have modals on top of the editor */}
              <SignInPage />
            </Show>
            <Sidebar />
            <Show
              when={wiki.wiki.openTopic.fileContent}
              fallback={<NoTopicChosen />}
            >
              <Editor />
            </Show>

            <Show
              when={!wiki.wiki.wikiFolderPath || user.user.mode === "Settings"}
            >
              <Settings />
            </Show>
            <Show when={user.user.mode === "Search Topics"}>
              <SearchModal
                items={wiki.wiki.topics}
                action={() => {}}
                searchPlaceholder="Search Topics"
              />
            </Show>
          </div>
          <Show when={import.meta.env.MODE === "development"}>
            <DevToolsPanel />
          </Show>
          <Show when={user.user.mode === "New Note"}>
            <InputModal />
          </Show>
        </WikiProvider>
      </UserProvider>
    </>
  )
}
