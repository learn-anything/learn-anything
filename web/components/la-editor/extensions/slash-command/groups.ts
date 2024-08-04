import { Group } from './types'

export const GROUPS: Group[] = [
  {
    name: 'format',
    title: 'Format',
    commands: [
      {
        name: 'heading1',
        label: 'Heading 1',
        iconName: 'Heading1',
        description: 'High priority section title',
        aliases: ['h1'],
        shortcuts: ['mod', 'alt', '1'],
        action: editor => {
          editor.chain().focus().setHeading({ level: 1 }).run()
        },
      },
      {
        name: 'heading2',
        label: 'Heading 2',
        iconName: 'Heading2',
        description: 'Medium priority section title',
        aliases: ['h2'],
        shortcuts: ['mod', 'alt', '2'],
        action: editor => {
          editor.chain().focus().setHeading({ level: 2 }).run()
        },
      },
      {
        name: 'heading3',
        label: 'Heading 3',
        iconName: 'Heading3',
        description: 'Low priority section title',
        aliases: ['h3'],
        shortcuts: ['mod', 'alt', '3'],
        action: editor => {
          editor.chain().focus().setHeading({ level: 3 }).run()
        },
      },
    ],
  },
  {
    name: 'list',
    title: 'List',
    commands: [
      {
        name: 'bulletList',
        label: 'Bullet List',
        iconName: 'List',
        description: 'Unordered list of items',
        aliases: ['ul'],
        shortcuts: ['mod', 'shift', '8'],
        action: editor => {
          editor.chain().focus().toggleBulletList().run()
        },
      },
      {
        name: 'numberedList',
        label: 'Numbered List',
        iconName: 'ListOrdered',
        description: 'Ordered list of items',
        aliases: ['ol'],
        shortcuts: ['mod', 'shift', '7'],
        action: editor => {
          editor.chain().focus().toggleOrderedList().run()
        },
      },
      {
        name: 'taskList',
        label: 'Task List',
        iconName: 'ListTodo',
        description: 'Task list with todo items',
        aliases: ['todo'],
        shortcuts: ['mod', 'shift', '8'],
        action: editor => {
          editor.chain().focus().toggleTaskList().run()
        },
      },
    ],
  },
  {
    name: 'insert',
    title: 'Insert',
    commands: [
      {
        name: 'codeBlock',
        label: 'Code Block',
        iconName: 'SquareCode',
        description: 'Code block with syntax highlighting',
        shortcuts: ['mod', 'alt', 'c'],
        shouldBeHidden: editor => editor.isActive('columns'),
        action: editor => {
          editor.chain().focus().setCodeBlock().run()
        },
      },
      {
        name: 'horizontalRule',
        label: 'Divider',
        iconName: 'Divide',
        description: 'Insert a horizontal divider',
        aliases: ['hr'],
        shortcuts: ['mod', 'shift', '-'],
        action: editor => {
          editor.chain().focus().setHorizontalRule().run()
        },
      },
      {
        name: 'blockquote',
        label: 'Blockquote',
        iconName: 'Quote',
        description: 'Element for quoting',
        shortcuts: ['mod', 'shift', 'b'],
        action: editor => {
          editor.chain().focus().setBlockquote().run()
        },
      },
    ],
  },
]

export default GROUPS
