import { KeyCode, KeyMod, editor as mEditor } from "monaco-editor"
import { createEffect, onCleanup, onMount } from "solid-js"
import { useWiki } from "../GlobalContext/wiki"

export default function Editor() {
  const wiki = useWiki()

  let parent!: HTMLDivElement
  let editor: mEditor.IStandaloneCodeEditor

  // Initialize Monaco
  onMount(() => {
    mEditor.defineTheme("dark", {
      base: "vs-dark", // can also be vs-dark or hc-black
      inherit: true, // can also be false to completely replace the builtin rules
      rules: [],
      colors: {
        "editor.background": "#222222",
        "editor.foreground": "#FFFFFF",
        "editorLineNumber.foreground": "#222222",
        "editorLineNumber.activeForeground": "#222222",
      },
    })

    editor = mEditor.create(parent, {
      language: "markdown",
      value: "SQLite is great",
      automaticLayout: true,
      lineDecorationsWidth: 5,
      lineNumbersMinChars: 3,
      padding: { top: 15 },
      theme: "dark",
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

  createEffect(() => {
    if (wiki.wiki.openTopic) {
      editor.setValue(wiki.wiki.openTopic.fileContent)
    }
  })

  return <div class="h-full w-full min-h-0 min-w-0 flex-1" ref={parent} />
}
