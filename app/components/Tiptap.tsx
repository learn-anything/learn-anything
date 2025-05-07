import { useEditor, EditorContent, FloatingMenu } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Suggestion from "@tiptap/suggestion"
import { ReactRenderer } from "@tiptap/react"
import HardBreak from "@tiptap/extension-hard-break"
import Paragraph from "@tiptap/extension-paragraph"
import Text from "@tiptap/extension-text"
import Heading from "@tiptap/extension-heading"
import BulletList from "@tiptap/extension-bullet-list"
import HorizontalRule from "@tiptap/extension-horizontal-rule"
import Blockquote from "@tiptap/extension-blockquote"
import CodeBlock from "@tiptap/extension-code-block"
import OrderedList from "@tiptap/extension-ordered-list"
import Image from "@tiptap/extension-image"
import { Extension } from "@tiptap/core"
import { PluginKey } from "@tiptap/pm/state"
import tippy from "tippy.js"
import "tippy.js/dist/tippy.css"
import React, { useState, useImperativeHandle, forwardRef } from "react"
import type { Editor } from "@tiptap/core"
import type { Range } from "@tiptap/core"

interface CommandProps {
  editor: Editor
  range: Range
}

interface CommandItem {
  title: string
  description: string
  command: (props: CommandProps) => void
}

const CommandList: CommandItem[] = [
  {
    title: "Heading 1",
    description: "Large section heading",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 1 })
        .run()
    },
  },
  {
    title: "Heading 2",
    description: "Medium section heading",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 2 })
        .run()
    },
  },
  {
    title: "Blockquote",
    description: "Insert a quote",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run()
    },
  },
  {
    title: "Code Block",
    description: "Code block with syntax highlighting",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
    },
  },
  {
    title: "Ordered List",
    description: "Numbered list",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },
  },
  {
    title: "Bullet List",
    description: "Bulleted list",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    },
  },
  {
    title: "Horizontal Rule",
    description: "Insert a horizontal line",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run()
    },
  },
  {
    title: "Image",
    description: "Insert an image",
    command: ({ editor, range }) => {
      const url = window.prompt("Enter image URL")
      if (url) {
        editor.chain().focus().deleteRange(range).setImage({ src: url }).run()
      }
    },
  },
]

const SlashCommandKey = new PluginKey("slashCommand")

const SlashCommand = Extension.create({
  name: "slashCommand",

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: "/",
        pluginKey: SlashCommandKey,
        command: ({ editor, range, props }) => {
          const item = props as CommandItem
          item.command({ editor, range })
        },
        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from)
          const type = $from.parent.type.name
          return type === "paragraph"
        },
        items: ({ query }: { query: string }) => {
          return CommandList.filter(
            (item) =>
              item.title.toLowerCase().includes(query.toLowerCase()) ||
              item.description.toLowerCase().includes(query.toLowerCase()),
          ).slice(0, 10)
        },
        render: () => {
          let component: ReactRenderer<CommandListComponentRef>
          let popup: any

          return {
            onStart: (props: any) => {
              component = new ReactRenderer(CommandListComponent, {
                props,
                editor: props.editor,
              })

              popup = tippy("body", {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
              })
            },

            onUpdate(props: any) {
              component.updateProps(props)
              popup[0].setProps({
                getReferenceClientRect: props.clientRect,
              })
            },

            onKeyDown({ event }: { event: KeyboardEvent }) {
              if (event.key === "Escape") {
                popup[0].hide()
                return true
              }
              return component.ref?.onKeyDown(event) ?? false
            },

            onExit() {
              popup[0].destroy()
              component.destroy()
            },
          }
        },
      }),
    ]
  },
})

interface CommandListComponentRef {
  onKeyDown: (event: KeyboardEvent) => boolean
}

const CommandListComponent = forwardRef<
  CommandListComponentRef,
  { items: CommandItem[]; command: (item: CommandItem) => void }
>(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (index: number) => {
    const item = items[index]
    if (item) {
      command(item)
    }
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowUp") {
      setSelectedIndex((selectedIndex + items.length - 1) % items.length)
      return true
    }
    if (event.key === "ArrowDown") {
      setSelectedIndex((selectedIndex + 1) % items.length)
      return true
    }
    if (event.key === "Enter") {
      selectItem(selectedIndex)
      return true
    }
    return false
  }

  useImperativeHandle(ref, () => ({
    onKeyDown,
  }))

  return (
    <div className="slash-menu">
    </div>
  )
})

const extensions = [
  StarterKit.configure({
    heading: false,
    blockquote: false,
    codeBlock: false,
    orderedList: false,
    bulletList: false,
    horizontalRule: false,
  }),
  Paragraph,
  Text,
  HardBreak,
  Heading.configure({
    levels: [1, 2, 3],
  }),
  Blockquote,
  CodeBlock,
  OrderedList,
  BulletList,
  HorizontalRule,
  Image,
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === "paragraph") {
        return "Type / for commands..."
      }
      return ""
    },
  }),
  SlashCommand,
]

export default function Tiptap() {
  const editor = useEditor({
    extensions,
    content: '<p>Type "/" for commands</p>',
    editorProps: {
      attributes: {
        class: "tiptap-editor",
      },
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="editor-wrapper">
      <FloatingMenu editor={editor}>
        <div className="slash-menu">
          {CommandList.map((command, index) => (
            <button
              key={index}
              className="slash-menu-item"
              onClick={() =>
                command.command({ editor, range: editor.state.selection })
              }
            >
              {command.title}
            </button>
          ))}
        </div>
      </FloatingMenu>
      <EditorContent editor={editor} />
    </div>
  )
}
