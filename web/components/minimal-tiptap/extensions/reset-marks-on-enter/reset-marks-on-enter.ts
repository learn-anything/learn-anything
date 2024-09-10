import { Extension } from '@tiptap/core'

export const ResetMarksOnEnter = Extension.create({
  name: 'resetMarksOnEnter',

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        if (
          editor.isActive('bold') ||
          editor.isActive('italic') ||
          editor.isActive('strike') ||
          editor.isActive('underline') ||
          editor.isActive('code')
        ) {
          editor.commands.splitBlock({ keepMarks: false })

          return true
        }

        return false
      }
    }
  }
})
