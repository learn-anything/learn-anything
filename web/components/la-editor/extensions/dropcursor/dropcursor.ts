import { Dropcursor as TiptapDropcursor } from '@tiptap/extension-dropcursor'

export const Dropcursor = TiptapDropcursor.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      width: 2,
      class: 'ProseMirror-dropcursor border',
    }
  },
})

export default Dropcursor
