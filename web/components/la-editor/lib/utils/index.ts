import { Editor } from "@tiptap/core"
import { LAEditorProps } from "../../la-editor"

export function getOutput(editor: Editor, output: LAEditorProps["output"]) {
	if (output === "html") return editor.getHTML()
	if (output === "json") return editor.getJSON()
	if (output === "text") return editor.getText()
	return ""
}

export * from "./isCustomNodeSelected"
export * from "./isTextSelected"
