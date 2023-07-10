import { Show } from "solid-js"
import { UserProvider, createUserState } from "./GlobalContext/user"
import EditorSettings from "./components/EditorSettings"
import Sidebar from "./components/Sidebar"
import TopicEditor from "./components/TopicEditor"

export default function App() {
  const user = createUserState()

  return (
    <UserProvider value={user}>
      <div
        style={{ width: "100vw", height: "100vh" }}
        class="flex items-center"
      >
        <Sidebar />
        <TopicEditor topic="karabiner" />
        <Show when={user.user.showEditorSettings}>
          <div class="absolute z-10 flex items-center justify-center top-0 left-0 w-screen h-screen">
            <div class="absolute top-0 left-0 w-full h-full bg-neutral-950 bg-opacity-50 bg-blur-lg " />
            <div class="w-4/5 h-5/6 z-20 dark:bg-neutral-900 bg-gray-100 rounded-3xl border-2 border-slate-200 dark:border-slate-600 border-opacity-10">
              <EditorSettings />
            </div>
          </div>
        </Show>
      </div>
    </UserProvider>
  )
}
