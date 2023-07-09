import { getFileContent } from "#preload"
import { createSignal, onMount } from "solid-js"
// TODO: don't know why it complains about types
// @ts-ignore
import { createCodeMirror, createEditorControlledValue } from "solid-codemirror"

export default function App() {
  // const [fileSignal, setFileSignal] = createSignal()
  // const [editorSignal, setEditorSignal] = createSignal()

  const [code, setCode] = createSignal()

  const { ref, editorView } = createCodeMirror({ onValueChange: setCode })
  createEditorControlledValue(editorView, code)

  // TODO: save this file into tinybase
  onMount(async () => {
    // await saveWikiFolderPath("/Users/nikiv/src/docs/wiki/docs/")
    // const res = await getWikiFolderPath()
    const fileContet = await getFileContent("macOS/apps/karabiner/karabiner.md")
    console.log(fileContet, "content")
    setCode(fileContet)
    // console.log(fileContet, "content")
    // console.log(res, "res")
  })

  // Update code after 2.5s
  // setTimeout(() => {
  //   setCode("console.log('updated!')")
  // }, 2500)

  // #root {
  //   margin: 0 auto;
  // }

  return (
    <>
      <div style={{ width: "100vw", height: "100vh" }}>
        <h1 class="text-red-600">Editor</h1>
        <div style={{ width: "50%" }} ref={ref} />
      </div>
    </>
  )
}
