import { Editor } from "@tiptap/react"

export const isTextSelected = (editor: Editor) => {
  if (!editor.isEditable) {
    return false
  }

  const { selection } = editor.state
  const { empty, from, to } = selection

  // Don't check for selection type since we only care about text content
  // Handle empty selections, including empty paragraphs
  if (empty) {
    return false
  }

  // Get text content and trim to handle whitespace-only selections
  const text = editor.state.doc.textBetween(from, to, " ").trim()
  return text.length > 0
}

export default isTextSelected
