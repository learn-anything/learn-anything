import * as React from "react"
import { Editor } from "@tiptap/react"
import { ShouldShowProps } from "../types"
import { isTextSelected } from "../lib/utils"

export const useTextmenuStates = (editor: Editor) => {
  const shouldShow = React.useCallback(
    ({ view }: ShouldShowProps) => {
      if (!view) {
        return false
      }

      return isTextSelected(editor)
    },
    [editor],
  )

  return {
    isBold: editor.isActive("bold"),
    isItalic: editor.isActive("italic"),
    isStrike: editor.isActive("strike"),
    isUnderline: editor.isActive("underline"),
    isCode: editor.isActive("code"),
    shouldShow,
  }
}
