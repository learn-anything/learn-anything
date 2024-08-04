'use client'

import * as React from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import { BubbleMenu } from './components/bubble-menu'
import { createExtensions } from './extensions'
import './styles/index.css'
import { cn } from '@/lib/utils'
export interface LAEditorProps extends React.HTMLProps<HTMLDivElement> {
  placeholder?: string
  editorClassName?: string
}

export const LAEditor = React.forwardRef<HTMLDivElement, LAEditorProps>(
  ({ placeholder, editorClassName, className, ...props }, ref) => {
    const editor = useEditor(
      {
        autofocus: false,
        extensions: createExtensions({ placeholder }),
        editorProps: {
          attributes: {
            autocomplete: 'off',
            autocorrect: 'off',
            autocapitalize: 'off',
            class: editorClassName || '',
          },
        },
        onUpdate: props => {
          console.log('onUpdate', props.editor.getHTML(), props.editor.getJSON())
        },
        content: ``,
      },
      [],
    )

    if (!editor) {
      return null
    }

    return (
      <div className={cn('la-editor relative flex h-full w-full grow flex-col', className)} {...props} ref={ref}>
        <EditorContent editor={editor} />
        <BubbleMenu editor={editor} />
      </div>
    )
  },
)

LAEditor.displayName = 'LAEditor'

export default LAEditor
