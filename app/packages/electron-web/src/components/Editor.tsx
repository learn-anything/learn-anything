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
    mEditor.defineTheme("dark", {
      base: "vs", // can also be vs-dark or hc-black
      inherit: true, // can also be false to completely replace the builtin rules
      rules: [
        {
          token: "comment",
          foreground: "ffa500",
          fontStyle: "italic underline",
        },
        { token: "comment.js", foreground: "008800", fontStyle: "bold" },
        { token: "comment.css", foreground: "0000ff" }, // will inherit fontStyle from `comment` above
      ],
      colors: {
        "editor.background": "#222222",
        "editor.foreground": "#FFFFFF",
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

  onMount(() => {
    // props.onEditorReady?.(editor, { Uri, editor: mEditor });
  })

  return <div class="h-full w-full min-h-0 min-w-0 flex-1" ref={parent} />
}
