import { StarterKit } from './starter-kit'
import { TaskList } from './task-list'
import { TaskItem } from './task-item'
import { HorizontalRule } from './horizontal-rule'
import { Blockquote } from './blockquote/blockquote'
import { SlashCommand } from './slash-command'
import { Heading } from './heading'
import { Link } from './link'
import { CodeBlockLowlight } from './code-block-lowlight'
import { Selection } from './selection'
import { Code } from './code'
import { Paragraph } from './paragraph'
import { BulletList } from './bullet-list'
import { OrderedList } from './ordered-list'
import { Dropcursor } from './dropcursor'

export interface ExtensionOptions {
  placeholder?: string
}

export const createExtensions = ({ placeholder = 'Start typing...' }: ExtensionOptions) => [
  Heading,
  Code,
  Link,
  TaskList,
  TaskItem,
  Selection,
  Paragraph,
  Dropcursor,
  Blockquote,
  BulletList,
  OrderedList,
  SlashCommand,
  HorizontalRule,
  CodeBlockLowlight,
  StarterKit.configure({
    placeholder: {
      placeholder: () => placeholder,
    },
  }),
]

export default createExtensions
