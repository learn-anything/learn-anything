import { HorizontalRule } from "../../extensions/horizontal-rule"
import { Link } from "../../extensions/link"
import { Editor } from "@tiptap/react"

export const isTableGripSelected = (node: HTMLElement) => {
  let container = node

  while (container && !["TD", "TH"].includes(container.tagName)) {
    container = container.parentElement!
  }

  const gripColumn =
    container &&
    container.querySelector &&
    container.querySelector("a.grip-column.selected")
  const gripRow =
    container &&
    container.querySelector &&
    container.querySelector("a.grip-row.selected")

  if (gripColumn || gripRow) {
    return true
  }

  return false
}

export const isCustomNodeSelected = (editor: Editor, node: HTMLElement) => {
  const customNodes = [HorizontalRule.name, Link.name]

  return (
    customNodes.some((type) => editor.isActive(type)) ||
    isTableGripSelected(node)
  )
}

export default isCustomNodeSelected
