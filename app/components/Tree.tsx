import React, { useState, useEffect } from "react"
import TreeItem, { WebsiteElement } from "./TreeItem"

type TreeProps = {
  data: WebsiteElement[]
  onSelectionChange?: (selectedNodes: WebsiteElement[]) => void
}

export default function Tree({ data, onSelectionChange }: TreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set())
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!initialized) {
      const allNodeIds = getAllNodeIds(data)
      setSelectedNodes(new Set(allNodeIds))

      if (onSelectionChange) {
        const selectedElements = findSelectedElements(data, new Set(allNodeIds))
        onSelectionChange(selectedElements)
      }

      setInitialized(true)
    }
  }, [data, initialized, onSelectionChange])

  const getAllNodeIds = (elements: WebsiteElement[]): string[] => {
    let ids: string[] = []

    for (const element of elements) {
      ids.push(element.id)

      if (element.children && element.children.length > 0) {
        ids = [...ids, ...getAllNodeIds(element.children)]
      }
    }

    return ids
  }

  const handleToggleExpand = (nodeId: string) => {
    const newExpandedNodes = new Set(expandedNodes)
    if (newExpandedNodes.has(nodeId)) {
      newExpandedNodes.delete(nodeId)
    } else {
      newExpandedNodes.add(nodeId)
    }
    setExpandedNodes(newExpandedNodes)
  }

  const handleNodeSelect = (
    nodeId: string,
    selected: boolean,
    childIds?: string[],
  ) => {
    console.log(
      `Selecting node ${nodeId}, selected: ${selected}, childIds:`,
      childIds,
    )

    const newSelectedNodes = new Set(selectedNodes)

    if (selected) {
      newSelectedNodes.add(nodeId)

      if (childIds && childIds.length > 0) {
        childIds.forEach((id) => newSelectedNodes.add(id))
      }
    } else {
      newSelectedNodes.delete(nodeId)
      if (childIds && childIds.length > 0) {
        childIds.forEach((id) => newSelectedNodes.delete(id))
      }
    }

    setSelectedNodes(newSelectedNodes)

    if (onSelectionChange) {
      const selectedElements = findSelectedElements(data, newSelectedNodes)
      onSelectionChange(selectedElements)
    }
  }

  const findSelectedElements = (
    elements: WebsiteElement[],
    selectedIds: Set<string>,
  ): WebsiteElement[] => {
    const result: WebsiteElement[] = []

    for (const element of elements) {
      if (selectedIds.has(element.id)) {
        result.push(element)
      }

      if (element.children && element.children.length > 0) {
        result.push(...findSelectedElements(element.children, selectedIds))
      }
    }

    return result
  }

  return (
    <div className="w-full">
      {data.map((node) => (
        <TreeItem
          key={node.id}
          node={node}
          level={0}
          onToggleExpand={handleToggleExpand}
          onNodeSelect={handleNodeSelect}
          expandedNodes={expandedNodes}
          selectedNodes={selectedNodes}
        />
      ))}
    </div>
  )
}
