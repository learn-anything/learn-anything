import * as React from "react"
import { Editor } from "@tiptap/react"

export const useTextmenuCommands = (editor: Editor) => {
  const onBold = React.useCallback(
    () => editor.chain().focus().toggleBold().run(),
    [editor],
  )
  const onItalic = React.useCallback(
    () => editor.chain().focus().toggleItalic().run(),
    [editor],
  )
  const onStrike = React.useCallback(
    () => editor.chain().focus().toggleStrike().run(),
    [editor],
  )
  const onCode = React.useCallback(
    () => editor.chain().focus().toggleCode().run(),
    [editor],
  )
  const onCodeBlock = React.useCallback(
    () => editor.chain().focus().toggleCodeBlock().run(),
    [editor],
  )
  const onQuote = React.useCallback(
    () => editor.chain().focus().toggleBlockquote().run(),
    [editor],
  )
  const onLink = React.useCallback(
    (url: string, inNewTab?: boolean) =>
      editor
        .chain()
        .focus()
        .setLink({ href: url, target: inNewTab ? "_blank" : "" })
        .run(),
    [editor],
  )

  return {
    onBold,
    onItalic,
    onStrike,
    onCode,
    onCodeBlock,
    onQuote,
    onLink,
  }
}
