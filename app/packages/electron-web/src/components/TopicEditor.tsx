import { getFileContent } from "#preload"
import { createSignal, onMount } from "solid-js"
// TODO: don't know why it complains about types
// @ts-ignore
import { createCodeMirror } from "solid-codemirror"
import { EditorView, lineNumbers } from "@codemirror/view"

interface Props {
  topic: string
}

export default function TopicEditor(props: Props) {
  const [topicContent, setTopicContent] = createSignal()

  const [showLineNumber, setShowLineNumber] = createSignal(true)

  const { ref, editorView, createExtension } = createCodeMirror({
    onValueChange: setTopicContent,
  })

  // TODO: load this file from tinybase sqlite
  // save all all files into sqlite tinybase, expose it via store
  onMount(async () => {
    // await saveWikiFolderPath("/Users/nikiv/src/docs/wiki/docs/")
    // const res = await getWikiFolderPath()
    // const fileContet = await getFileContent("macOS/apps/karabiner/karabiner.md")
    // console.log(fileContet, "content")
    // setContent(fileContet)
  })

  return (
    <div
      class="dark:bg-neutral-900 bg-white flex flex-col gap-4 p-10 h-full overflow-scroll"
      style={{ width: "78%" }}
    >
      <h1 class="font-bold text-3xl">Editor</h1>
      <div ref={ref} />
    </div>
  )
}
