/*
 * Add block-node class to blockquote element
 */
import { mergeAttributes } from '@tiptap/core'
import { Blockquote as TiptapBlockquote } from '@tiptap/extension-blockquote'

export const Blockquote = TiptapBlockquote.extend({
  renderHTML({ HTMLAttributes }) {
    return ['blockquote', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { class: 'block-node' }), 0]
  },
})

export default Blockquote
