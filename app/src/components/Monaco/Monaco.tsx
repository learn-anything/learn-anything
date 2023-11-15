import { createEffect, createSignal } from "solid-js"
import { invoke } from "@tauri-apps/api/tauri"
import * as scheduled from "@solid-primitives/scheduled"
import { MonacoEditor } from "solid-monaco"
import { useGlobalState } from "../../GlobalContext/global"

export function Monaco() {
  const [value, setValue] = createSignal<string>("some text")
  const global = useGlobalState()

  // TODO: should not write to file when file opens, I think (currently does)
  const scheduledFileUpdate = scheduled.throttle(
    async (newFileContent: string) => {
      if (global.state.currentlyOpenFile) {
        const filePath = global.state.currentlyOpenFile.filePath
        const pathToFile = `${global.state.localFolderPath}/${filePath}`
        const indexOfCurrentlyEditedFile = global.state.files.findIndex(
          (f) => f.filePath === filePath,
        )

        global.set(
          "files",
          indexOfCurrentlyEditedFile,
          "fileContent",
          newFileContent,
        )
        console.log(pathToFile, "path to file")
        console.log("write to file")
        await invoke("overwrite_file_content", {
          path: pathToFile,
          newContent: newFileContent,
        })
      }
    },
    1000,
  )

  createEffect(() => {
    if (global.state.currentlyOpenFile?.fileContent) {
      scheduledFileUpdate(global.state.currentlyOpenFile?.fileContent)
    }
  })

  return (
    <div class="w-full h-full overflow-auto">
      <MonacoEditor
        language={"markdown"}
        onChange={(text) => {
          global.set("currentlyOpenFile", "fileContent", text)
        }}
        options={{
          quickSuggestions: false,
          padding: { top: 24 },
          minimap: { enabled: false },
          wordWrap: "on",
          lineNumbers: "off",
        }}
        theme="vs-dark"
        value={global.state.currentlyOpenFile?.fileContent}
      />
    </div>
  )
}
