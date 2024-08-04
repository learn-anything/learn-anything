import { NodeViewContent, Editor, NodeViewWrapper } from '@tiptap/react'
import { Icon } from '../../../components/ui/icon'
import { useCallback } from 'react'
import { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { Node } from '@tiptap/core'

interface TaskItemProps {
  editor: Editor
  node: ProseMirrorNode
  updateAttributes: (attrs: Record<string, any>) => void
  extension: Node
}

export const TaskItemView: React.FC<TaskItemProps> = ({ node, updateAttributes, editor, extension }) => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked

      if (!editor.isEditable && !extension.options.onReadOnlyChecked) {
        return
      }

      if (editor.isEditable) {
        updateAttributes({ checked })
      } else if (extension.options.onReadOnlyChecked) {
        if (!extension.options.onReadOnlyChecked(node, checked)) {
          event.target.checked = !checked
        }
      }
    },
    [editor.isEditable, extension.options, node, updateAttributes],
  )

  return (
    <NodeViewWrapper as="li" data-type="taskItem" data-checked={node.attrs.checked}>
      <div className="taskItem-checkbox-container">
        <Icon name="GripVertical" data-drag-handle className="taskItem-drag-handle" />

        <label>
          <input type="checkbox" checked={node.attrs.checked} onChange={handleChange} className="taskItem-checkbox" />
        </label>
      </div>
      <div className="taskItem-content">
        <NodeViewContent />
      </div>
    </NodeViewWrapper>
  )
}

export default TaskItemView
