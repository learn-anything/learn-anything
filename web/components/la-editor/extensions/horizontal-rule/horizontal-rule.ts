/*
 * Wrap the horizontal rule in a div element.
 * Also add a keyboard shortcut to insert a horizontal rule.
 */
import { HorizontalRule as TiptapHorizontalRule } from '@tiptap/extension-horizontal-rule'

export const HorizontalRule = TiptapHorizontalRule.extend({
  addKeyboardShortcuts() {
    return {
      'Mod-Alt--': () =>
        this.editor.commands.insertContent({
          type: this.name,
        }),
    }
  },
})

export default HorizontalRule
