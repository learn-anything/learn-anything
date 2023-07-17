import { createSignal, onMount } from "solid-js"
// TODO: don't know why it complains about types
// @ts-ignore
import { createCodeMirror } from "solid-codemirror"
import { useUser } from "../GlobalContext/user"

export default function Editor() {
  const [editorContent, setEditorContent] = createSignal("")
  const user = useUser()

  onMount(() => {
    setEditorContent(user.user.topicContent)
  })

  const { ref, createExtension, editorView } = createCodeMirror({
    onValueChange: setEditorContent,
  })

  return (
    <div
      class="dark:bg-neutral-900 bg-white flex flex-col gap-4 p-10 h-full overflow-scroll"
      style={{ width: "78%" }}
    >
      <h1 class="font-bold text-3xl">Editor</h1>
      <button
        onClick={() => {
          console.log(user.user.topicContent, "topic content")
        }}
      >
        press me
      </button>
      <div ref={ref} />
    </div>
  )
}
