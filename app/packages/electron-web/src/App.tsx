import { Show, createSignal } from "solid-js"
import Sidebar from "./components/Sidebar"
import TopicEditor from "./components/TopicEditor"
import EditorSettings from "./components/EditorSettings"

export default function App() {
  const [showEditorSettings, setShowEditorSettings] = createSignal(false)

  return (
    <div style={{ width: "100vw", height: "100vh" }} class="flex items-center">
      <Sidebar />
      <TopicEditor topic="karabiner" />
      <Show when={showEditorSettings()}>
        <div class="absolute z-10 flex items-center justify-center top-0 left-0 w-screen h-screen">
          <div
            onClick={() => {
              setShowEditorSettings(false)
            }}
            class="absolute top-0 left-0 w-full h-full bg-neutral-950 bg-opacity-50 bg-blur-lg "
          ></div>
          <div class="w-4/5 h-5/6 z-20 dark:bg-neutral-900 bg-gray-100 rounded-3xl border-2 border-slate-200 dark:border-slate-600 border-opacity-10">
            <EditorSettings />
          </div>
        </div>
      </Show>
    </div>
  )
}
