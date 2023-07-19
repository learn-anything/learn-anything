import { Show, createSignal } from "solid-js"
import { UserProvider, createUserState } from "./GlobalContext/user"
import Editor from "./components/Editor"
import Sidebar from "./components/Sidebar"
import ToolBar from "./components/ToolBar"
import SignInPage from "./components/SignInPage"
import Settings from "./components/Settings"
import { getTopicsSidebar, syncWikiFromSeed } from "#preload"

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
        #Settings {
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
          <Show when={user.user.showSignIn}>
            <SignInPage />
          </Show>
          <Sidebar />
          <Editor />
          <Show when={!user.user.wikiFolderPath}>
            <div class="absolute z-10 flex items-center justify-center top-0 left-0 w-screen h-screen">
              <div
                id="SettingsBackDrop"
                class="absolute top-0 left-0 w-full h-full bg-neutral-950 bg-opacity-50 bg-blur-lg "
              />
              <div
                id="Settings"
                class="w-4/5 h-5/6 z-20 dark:bg-neutral-900 bg-gray-100 rounded-3xl border border-opacity-50 border-slate-200 dark:border-slate-800"
              >
                <Settings />
              </div>
            </div>
          </Show>
          <Show when={showToolBar()}>
            <ToolBar setShowToolBar={setShowToolBar} />
          </Show>
        </div>
        <Show when={import.meta.env.MODE === "development"}>
          <div class="fixed flex flex-col items-center p-4 bottom-5 right-5 rounded-xl border-slate-400 border border-opacity-50 bg-transparent w-80 h-80">
            <div class="flex items-center text-lg justify-center font-semibold w-full">
              DevTools
            </div>
            <div class="flex w-full h-full  items-center p-5 text-lg flex-col">
              <div
                class="cursor-pointer"
                onClick={() => {
                  syncWikiFromSeed()
                }}
              >
                Seed TinyBase
              </div>
              <div
                class="cursor-pointer"
                onClick={async () => {
                  const topics = await getTopicsSidebar()
                  console.log(topics, "topics")
                }}
              >
                Load Sidebar
              </div>
            </div>
          </div>
        </Show>
      </UserProvider>
    </>
  )
}
