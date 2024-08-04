import { BulletList as TiptapBulletList } from '@tiptap/extension-bullet-list'

export const BulletList = TiptapBulletList.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'list-node',
      },
    }
  },
})

export default BulletList
