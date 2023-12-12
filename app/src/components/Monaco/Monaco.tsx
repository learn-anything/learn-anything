import * as scheduled from "@solid-primitives/scheduled"
import { invoke } from "@tauri-apps/api/tauri"
import { createEffect, createSignal, onCleanup, onMount } from "solid-js"
import { initVimMode } from "monaco-vim"

import { useGlobalState } from "~/GlobalContext/global"
import { MonacoEditor } from "~/components/solid-monaco"

export function Monaco() {
  const global = useGlobalState()
  const [value, setValue] = createSignal<string>("some text")

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
      scheduledFileUpdate(global.state.currentlyOpenFile.fileContent)
    }
  })

  let vimMode: any

  return (
    <>
      <style>
        {`
        ::-webkit-scrollbar {
          display: none;
      }
      `}
      </style>
      <div class="w-full h-full overflow-auto ">
        <MonacoEditor
          language={"markdown"}
          onChange={(text) => {
            global.set("currentlyOpenFile", "fileContent", text)
          }}
          options={{
            scrollbar: {
              vertical: "hidden",
            },
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            quickSuggestions: false,
            padding: { top: 24 },
            minimap: { enabled: false },
            wordWrap: "on",
            lineNumbers: "off",
          }}
          value={global.state.currentlyOpenFile?.fileContent}
          onMount={(_, ed) => {
            vimMode = initVimMode(ed, document.createElement("div"))
          }}
        />
      </div>
    </>
  )
}
