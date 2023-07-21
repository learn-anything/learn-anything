import { createEffect, createSignal, onMount } from "solid-js"
import {
  Uri,
  languages,
  editor as mEditor,
  KeyMod,
  KeyCode,
} from "monaco-editor"
import { useWiki } from "../GlobalContext/wiki"

export default function Editor() {
  const [editorContent, setEditorContent] = createSignal("SQLite is great.")
  let editor: mEditor.IStandaloneCodeEditor

  const wiki = useWiki()

  // const model = () => mEditor.getModel(Uri.parse(props.url));

  createEffect(() => {
    console.log(wiki, "wiki")
  })

  // const wiki = useWiki()
  // createEffect(() => {
  //   console.log(wiki, "wiki")
  // })
  return <div>editor</div>
}
