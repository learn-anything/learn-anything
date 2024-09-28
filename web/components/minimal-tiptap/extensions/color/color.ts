import { Color as TiptapColor } from '@tiptap/extension-color'
import { Plugin } from '@tiptap/pm/state'

export const Color = TiptapColor.extend({
  addProseMirrorPlugins() {
    return [
      ...(this.parent?.() || []),
      new Plugin({
        props: {
          handleKeyDown: (_, event) => {
            if (event.key === 'Enter') {
              this.editor.commands.unsetColor()
            }
            return false
          }
        }
      })
    ]
  }
})
