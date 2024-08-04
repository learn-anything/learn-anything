import { ReactNodeViewRenderer } from '@tiptap/react'
import { mergeAttributes } from '@tiptap/core'
import { TaskItemView } from './components/task-item-view'
import { TaskItem as TiptapTaskItem } from '@tiptap/extension-task-item'

export const TaskItem = TiptapTaskItem.extend({
  name: 'taskItem',

  draggable: true,

  addOptions() {
    return {
      ...this.parent?.(),
      nested: true,
    }
  },

  addAttributes() {
    return {
      checked: {
        default: false,
        keepOnSplit: false,
        parseHTML: element => {
          const dataChecked = element.getAttribute('data-checked')
          return dataChecked === '' || dataChecked === 'true'
        },
        renderHTML: attributes => ({
          'data-checked': attributes.checked,
        }),
      },
    }
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'li',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': this.name,
      }),
      [
        'div',
        { class: 'taskItem-checkbox-container' },
        [
          'label',
          [
            'input',
            {
              type: 'checkbox',
              checked: node.attrs.checked ? 'checked' : null,
              class: 'taskItem-checkbox',
            },
          ],
        ],
      ],
      ['div', { class: 'taskItem-content' }, 0],
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(TaskItemView, {
      as: 'span',
    })
  },
})
