import { getFileContent } from "#preload"
import { createSignal, onMount } from "solid-js"
// TODO: don't know why it complains about types
// @ts-ignore
import { createCodeMirror, createEditorControlledValue } from "solid-codemirror"
import Sidebar from "./components/Sidebar"
import { EditorView, lineNumbers } from "@codemirror/view"

export default function App() {
  const [content, setContent] = createSignal()
  const [showLineNumber, setShowLineNumber] = createSignal(true)

  const { ref, editorView, createExtension } = createCodeMirror({
    onValueChange: setContent,
  })

  const theme = EditorView.theme({
    "&": {
      background: "red",
    },
  })

  // Add a static custom theme
  createExtension(theme)

  // Toggle extension
  createExtension(() => (showLineNumber() ? lineNumbers() : []))

  // Remove line numbers after 2.5s
  setTimeout(() => {
    setShowLineNumber(false)
  }, 2500)

  // console.log(createExtension)

  // const lineWrap = EditorView.lineWrapping

  // createExtension(lineWrap)

  // createEditorControlledValue(editorView, content)

  // const [fileSignal, setFileSignal] = createSignal()
  // const [editorSignal, setEditorSignal] = createSignal()

  // TODO: load this file from tinybase sqlite
  // save all all files into sqlite tinybase, expose it via store
  onMount(async () => {
    // await saveWikiFolderPath("/Users/nikiv/src/docs/wiki/docs/")
    // const res = await getWikiFolderPath()
    const fileContet = await getFileContent("macOS/apps/karabiner/karabiner.md")
    console.log(fileContet, "content")
    setContent(fileContet)
  })

  return (
    <>
      <div
        style={{ width: "100vw", height: "100vh" }}
        class="flex items-center justify-center"
      >
        <Sidebar />
        <div
          class="dark:bg-neutral-900 bg-white flex flex-col gap-4 p-10 h-full overflow-scroll"
          style={{ width: "75%" }}
        >
          <h1 class="font-bold text-3xl">Editor</h1>
          <div style={{}} ref={ref} />
        </div>
      </div>
    </>
  )
}
