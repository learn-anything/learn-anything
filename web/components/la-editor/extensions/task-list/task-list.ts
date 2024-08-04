import { TaskList as TiptapTaskList } from '@tiptap/extension-task-list'

export const TaskList = TiptapTaskList.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'list-node',
      },
    }
  },
})
