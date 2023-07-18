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
    <div
      class="dark:bg-neutral-900 bg-white flex flex-col gap-4 p-10 h-full overflow-scroll"
      style={{ width: "78%" }}
    >
      <h1 class="font-bold text-3xl">{user.user.topicName}</h1>
      {/* <input type="text" value={editorContent()} /> */}
      <div ref={ref} />
    </div>
  )
}
