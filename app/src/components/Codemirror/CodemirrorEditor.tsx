import { useGlobalState } from "../../GlobalContext/global"
import { createEffect } from "solid-js"
import { createCodeMirror } from "./createCodeMirror"
import * as scheduled from "@solid-primitives/scheduled"
import { invoke } from "@tauri-apps/api/tauri"

export function CodemirrorEditor() {
  const global = useGlobalState()

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
        await invoke("overwrite_file_content", {
          path: pathToFile,
          newContent: newFileContent,
        })
      }
    },
    1000,
  )

  const { editorView, ref: editorRef } = createCodeMirror({
    /**
     * The initial value of the editor
     */
    value: "",
    /**
     * Fired whenever the editor code value changes.
     */
    onValueChange: (value) => {
      // console.log("value changed", value)
      scheduledFileUpdate(value)
    },
    /**
     * Fired whenever a change occurs to the document, every time the view updates.
     */
    onModelViewUpdate: (modelView) => {
      // console.log("modelView updated", modelView)
    },
    /**
     * Fired whenever a transaction has been dispatched to the view.
     * Used to add external behavior to the transaction [dispatch function](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch) for this editor view, which is the way updates get routed to the view
     */
    onTransactionDispatched: (tr, view) => {
      // console.log("Transaction", tr)
    },
  })

  createEffect(() => {
    const localValue = editorView()?.state.doc.toString()
    editorView()?.dispatch({
      changes: {
        from: 0,
        to: localValue?.length,
        insert: global.state.currentlyOpenFile?.fileContent,
      },
    })
  })

  return (
    <>
      {/* TODO: can this be done with https://github.com/lxsmnsyc/solid-styled? should it? when i tried it, no styles got applied */}
      <style>
        {`
        @media (prefers-color-scheme: dark) {
          // TODO: does not work https://discuss.codemirror.net/t/codemirror-cursor-class-does-not-work-in-safari/7409/3
          // need to have to add another selector for your rule to override the default theme (https://codemirror.net/examples/styling/)
          .cm-cursor {
            color: white;
          }
        }
        .cm-editor {
          height: 100%;
        }
        ::-webkit-scrollbar {
          display: none;
        }
        .cm-line {
          text-align: start !important;
          padding: 0 !important;
        }
        .cm-focused {
          outline: none !important;
        }
        `}
      </style>
      <div
        ref={editorRef}
        class="dark:bg-neutral-900 bg-white flex flex-col gap-4 py-10 pr-10 pl-2 h-full overflow-scroll"
        style={{ width: "100%" }}
      />
    </>
  )
}
