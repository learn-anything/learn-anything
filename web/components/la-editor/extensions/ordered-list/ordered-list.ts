import { OrderedList as TiptapOrderedList } from '@tiptap/extension-ordered-list'

export const OrderedList = TiptapOrderedList.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'list-node',
      },
    }
  },
})

export default OrderedList
