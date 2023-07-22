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
    mEditor.defineTheme("light", {
      base: "vs", // can also be vs-dark or hc-black
      inherit: true, // can also be false to completely replace the builtin rules
      rules: [],
      colors: {
        "editor.background": "#ffffff",
        "editor.foreground": "#000000",
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
      wordWrap: "on",
      minimap: {
        enabled: false,
      },
      scrollbar: {
        vertical: "hidden", // Set to 'hidden' to remove the built-in vertical scrollbar
      },
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

  return (
    <>
      <style>{`
      ::-webkit-scrollbar {
        display: none;
    }
    .decorationsOverviewRuler {
      display: none !important;
    }

    /* Remove the right border when the scrollbar is hidden */
    .monaco-editor .margin,
    .monaco-editor .content .lines-content {
      right: 0 !important;
    }
    `}</style>
      <div class="h-full w-full min-h-0 min-w-0 flex-1 pr-10" ref={parent} />
    </>
  )
}
