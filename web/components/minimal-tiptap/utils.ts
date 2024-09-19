import type { Editor } from "@tiptap/core"
import type { MinimalTiptapProps } from "./minimal-tiptap"

export function getOutput(editor: Editor, format: MinimalTiptapProps["output"]) {
	if (format === "json") {
		return editor.getJSON()
	}

	if (format === "html") {
		return editor.getText() ? editor.getHTML() : ""
	}

	return editor.getText()
}
