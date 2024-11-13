import { Extension } from "@tiptap/react"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import type { Node, NodeType } from "@tiptap/pm/model"

function nodeEqualsType({
  types,
  node,
}: {
  types: NodeType | NodeType[]
  node: Node | null
}) {
  if (!node) return false

  if (Array.isArray(types)) {
    return types.includes(node.type)
  }

  return node.type === types
}

export interface TrailingNodeOptions {
  node: string
  notAfter: string[]
}

export const TrailingNode = Extension.create<TrailingNodeOptions>({
  name: "trailingNode",

  addOptions() {
    return {
      node: "paragraph",
      notAfter: ["paragraph"],
    }
  },

  addProseMirrorPlugins() {
    const plugin = new PluginKey(this.name)
    const disabledNodes = Object.entries(this.editor.schema.nodes)
      .map(([, value]) => value)
      .filter((node) => this.options.notAfter.includes(node.name))

    return [
      new Plugin({
        key: plugin,
        appendTransaction: (_, __, state) => {
          const { doc, tr, schema } = state
          const shouldInsertNodeAtEnd = plugin.getState(state)
          const endPosition = doc.content.size
          const type = schema.nodes[this.options.node]

          if (!shouldInsertNodeAtEnd) {
            return
          }

          return tr.insert(endPosition, type.create())
        },
        state: {
          init: (_, state) => {
            const lastNode = state.tr.doc.lastChild

            return !nodeEqualsType({ node: lastNode, types: disabledNodes })
          },
          apply: (tr, value) => {
            if (!tr.docChanged) {
              return value
            }

            const lastNode = tr.doc.lastChild

            return !nodeEqualsType({ node: lastNode, types: disabledNodes })
          },
        },
      }),
    ]
  },
})
