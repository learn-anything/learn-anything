/*
 * Add heading level validation. decimal (0-9)
 * Add heading class to heading element
 */
import { mergeAttributes } from '@tiptap/core'
import TiptapHeading from '@tiptap/extension-heading'
import type { Level } from '@tiptap/extension-heading'

export const Heading = TiptapHeading.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      levels: [1, 2, 3] as Level[],
      HTMLAttributes: {
        class: 'heading-node',
      },
    }
  },

  renderHTML({ node, HTMLAttributes }) {
    const nodeLevel = parseInt(node.attrs.level, 10) as Level
    const hasLevel = this.options.levels.includes(nodeLevel)
    const level = hasLevel ? nodeLevel : this.options.levels[0]

    return [`h${level}`, mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },
})

export default Heading
