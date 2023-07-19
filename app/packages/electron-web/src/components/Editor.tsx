import { createEffect, createSignal, onMount } from "solid-js"
import { createCodeMirror, createEditorControlledValue } from "solid-codemirror"
import { useUser } from "../GlobalContext/user"

export default function Editor() {
  const [editorContent, setEditorContent] = createSignal("")
  const user = useUser()

  createEffect(() => {
    setEditorContent(user.user.topicContent)
  })

  const { ref, createExtension, editorView } = createCodeMirror({
    onValueChange: setEditorContent,
  })

  createEditorControlledValue(editorView, () => {
    return editorContent()
  })

  return (
    <>
      <style>
        {`
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
        class="dark:bg-neutral-900 bg-white flex flex-col gap-4 py-10 pr-10 pl-2 h-full overflow-scroll"
        style={{ width: "78%" }}
      >
        <h1 class="font-bold pl-7 text-3xl">{user.user.topicToEdit}</h1>
        {/* <input type="text" value={editorContent()} /> */}
        <div class="h-full" ref={ref} />
      </div>
    </>
  )
}
