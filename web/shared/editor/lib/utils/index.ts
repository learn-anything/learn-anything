import { LaEditorProps } from "@shared/editor"
import { Editor } from "@tiptap/core"

export function getOutput(editor: Editor, format: LaEditorProps["output"]) {
  if (format === "json") {
    return editor.getJSON()
  }

  if (format === "html") {
    return editor.getText() ? editor.getHTML() : ""
  }

  return editor.getText()
}

export * from "./isCustomNodeSelected"
export * from "./isTextSelected"
