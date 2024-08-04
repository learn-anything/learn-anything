import { Code as TiptapCode } from '@tiptap/extension-code'

export const Code = TiptapCode.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'inline',
        spellCheck: 'false',
      },
    }
  },
})

export default Code
