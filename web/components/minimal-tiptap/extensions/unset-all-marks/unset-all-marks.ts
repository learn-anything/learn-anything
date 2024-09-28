import { Extension } from '@tiptap/core'

export const UnsetAllMarks = Extension.create({
  addKeyboardShortcuts() {
    return {
      'Mod-\\': () => this.editor.commands.unsetAllMarks()
    }
  }
})
