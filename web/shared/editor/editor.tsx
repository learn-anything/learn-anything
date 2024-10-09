import * as React from "react"
import "./styles/index.css"

import { EditorContent } from "@tiptap/react"
import { Content } from "@tiptap/core"
import { BubbleMenu } from "./components/bubble-menu"
import { cn } from "@/lib/utils"
import { useLaEditor, UseLaEditorProps } from "./hooks/use-la-editor"

export interface LaEditorProps extends UseLaEditorProps {
  value?: Content
  className?: string
  editorContentClassName?: string
}

export const LaEditor = React.memo(
  React.forwardRef<HTMLDivElement, LaEditorProps>(
    ({ className, editorContentClassName, ...props }, ref) => {
      const editor = useLaEditor(props)

      if (!editor) {
        return null
      }

      return (
        <div
          className={cn("relative flex h-full w-full grow flex-col", className)}
          ref={ref}
        >
          <EditorContent
            editor={editor}
            className={cn("la-editor", editorContentClassName)}
          />
          <BubbleMenu editor={editor} />
        </div>
      )
    },
  ),
)

LaEditor.displayName = "LaEditor"

export default LaEditor
