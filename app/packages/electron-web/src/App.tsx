import { Show, createSignal } from "solid-js"
import { UserProvider, createUserState } from "./GlobalContext/user"
import Editor from "./components/Editor"
import EditorSettings from "./components/EditorSettings"
import Sidebar from "./components/Sidebar"
import ToolBar from "./components/ToolBar"

export default function App() {
  const user = createUserState()
  const [showToolBar, setShowToolBar] = createSignal(false)

  return (
    <>
      <style>
        {`
        #SettingsBackDrop {
          animation: 0.3s BackDropOpacity forwards linear
        }
        @keyframes BackDropOpacity {
          0% {
            opacity: 0
          }
          100% {
            opacity: 1
          }
        }
        #EditorSettings {
          animation: 0.1s ScaleSettings forwards linear
        }
        @keyframes ScaleSettings {
          0% {
            transform: scale(0.8);
            opacity: 0
          }
          100% {
            trasform: scale(1);
            opacity: 1
          }
        }
      `}
      </style>
      <UserProvider value={user}>
        <div
          style={{ width: "100vw", height: "100vh" }}
          class="flex items-center"
        >
          <Show when={true}>
            <div class="absolute flex items-center justify-center top-0 right-0 z-40 w-screen h-screen bg-neutral-950">
              <div class="rounded-lg p-5 flex items-center justify-center flex-col gap-5 border-slate-400 border-opacity-50 border">
                <div>Sign in</div>
                <input
                  type="text"
                  placeholder="Sign in"
                  class="w-full p-1 px-4 border rounded-md bg-transparent border-slate-400 border-opacity-50"
                />
              </div>
            </div>
          </Show>
          <Sidebar />
          <Editor />
          <Show when={!user.user.wikiPath}>
            <div class="absolute z-10 flex items-center justify-center top-0 left-0 w-screen h-screen">
              <div
                id="SettingsBackDrop"
                class="absolute top-0 left-0 w-full h-full bg-neutral-950 bg-opacity-50 bg-blur-lg "
              />
              <div
                id="EditorSettings"
                class="w-4/5 h-5/6 z-20 dark:bg-neutral-900 bg-gray-100 rounded-3xl border border-opacity-50 border-slate-200 dark:border-slate-800"
              >
                <EditorSettings />
              </div>
            </div>
          </Show>
          <Show when={showToolBar()}>
            <ToolBar setShowToolBar={setShowToolBar} />
          </Show>
        </div>
      </UserProvider>
    </>
  )
}
