import { createEffect, createSignal, onCleanup, onMount } from "solid-js"
import {
  Uri,
  languages,
  editor as mEditor,
  KeyMod,
  KeyCode,
} from "monaco-editor"
import { useWiki } from "../GlobalContext/wiki"

export default function Editor() {
  const wiki = useWiki()

  let parent!: HTMLDivElement
  let editor: mEditor.IStandaloneCodeEditor

  // Initialize Monaco
  onMount(() => {
    editor = mEditor.create(parent, {
      model: null,
      automaticLayout: true,
      lineDecorationsWidth: 5,
      lineNumbersMinChars: 3,
      padding: { top: 15 },
    })

    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyS, () => {
      if (editor) {
        // auto-format
        editor.getAction("editor.action.formatDocument")?.run()
        // auto-fix problems
        // props.displayErrors && editor.getAction('eslint.executeAutofix')?.run();
        editor.focus()
      }
    })

    editor.onDidChangeModelContent(() => {
      const code = editor.getValue()
      // props.onDocChange?.(code)
      // runLinter(code)
    })
  })
  onCleanup(() => editor?.dispose())

  return <div class="min-h-0 min-w-0 flex-1 p-0" ref={parent} />
}
