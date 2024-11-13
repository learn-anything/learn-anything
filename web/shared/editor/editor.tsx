import * as React from "react"
import { EditorContent } from "@tiptap/react"
import { Content } from "@tiptap/core"
import { BubbleMenu } from "./components/bubble-menu"
import { cn } from "@/lib/utils"
import { useLaEditor, UseLaEditorProps } from "./hooks/use-la-editor"
import { MeasuredContainer } from "./components/measured-container"

export interface LaEditorProps extends UseLaEditorProps {
  value?: Content
  className?: string
  editorContentClassName?: string
}

export const LaEditor = React.forwardRef<HTMLDivElement, LaEditorProps>(
  ({ className, editorContentClassName, ...props }, ref) => {
    const editor = useLaEditor(props)

    if (!editor) {
      return null
    }

    return (
      <MeasuredContainer
        as="div"
        name="editor"
        className={cn("relative flex h-full w-full grow flex-col", className)}
        ref={ref}
      >
        <EditorContent
          editor={editor}
          className={cn("la-editor", editorContentClassName)}
        />
        <BubbleMenu editor={editor} />
      </MeasuredContainer>
    )
  },
)

LaEditor.displayName = "LaEditor"

export default LaEditor
