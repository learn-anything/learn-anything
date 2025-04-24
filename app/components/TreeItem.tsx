import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faFolder,
  faFolderOpen,
  faFile,
  faCode,
  faImage,
  faLink,
  faFont,
  faTable,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons"

export type WebsiteElement = {
  id: string
  name: string
  type:
    | "page"
    | "component"
    | "image"
    | "style"
    | "script"
    | "api"
    | "data"
    | "layout"
    | "section"
  url?: string
  selected?: boolean
  children?: WebsiteElement[]
}

export type TreeItemProps = {
  node: WebsiteElement
  level: number
  onToggleExpand: (nodeId: string) => void
  onNodeSelect: (
    nodeId: string,
    isSelected: boolean,
    childIds?: string[],
  ) => void
  expandedNodes: Set<string>
  selectedNodes: Set<string>
}

const getIconForType = (type: string, isExpanded: boolean) => {
  switch (type) {
    case "page":
      return isExpanded ? faFolderOpen : faFolder
    case "component":
      return faCode
    case "image":
      return faImage
    case "style":
      return faFont
    case "script":
      return faCode
    case "api":
      return faLink
    case "data":
      return faTable
    case "layout":
      return isExpanded ? faFolderOpen : faFolder
    case "section":
      return isExpanded ? faFolderOpen : faFolder
    default:
      return faGlobe
  }
}

export default function TreeItem({
  node,
  level,
  onToggleExpand,
  onNodeSelect,
  expandedNodes,
  selectedNodes,
}: TreeItemProps) {
  const isExpanded = expandedNodes.has(node.id)
  const isSelected = selectedNodes.has(node.id)
  const hasChildren = node.children && node.children.length > 0

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (hasChildren) {
      onToggleExpand(node.id)
    }
  }

  const getAllChildIds = (node: WebsiteElement): string[] => {
    let ids: string[] = []
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        ids.push(child.id)
        ids = [...ids, ...getAllChildIds(child)]
      })
    }
    return ids
  }

  const handleSelect = (e: React.MouseEvent<HTMLInputElement>) => {
    const isChecked = (e.target as HTMLInputElement).checked

    if (hasChildren) {
      const childIds = getAllChildIds(node)
      onNodeSelect(node.id, isChecked, childIds)
    } else {
      onNodeSelect(node.id, isChecked)
    }
  }

  const handleItemClick = () => {
    if (hasChildren) {
      const childIds = getAllChildIds(node)
      onNodeSelect(node.id, !isSelected, childIds)
    } else {
      onNodeSelect(node.id, !isSelected)
    }
  }

  const icon = getIconForType(node.type, isExpanded)

  return (
    <div className="w-full text-xs">
      <div
        className="flex items-center py-1.5 px-3 my-0.5 rounded-lg hover:bg-white/5 transition-colors"
        style={{ paddingLeft: `${level * 10 + 8}px` }}
      >
        {hasChildren && (
          <button
            onClick={handleToggleExpand}
            className="mr-2 text-xs focus:outline-none"
          >
            <span className="text-xs">{isExpanded ? "—" : "•"}</span>
          </button>
        )}
        {!hasChildren && <div className="w-4 mr-2" />}

        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {}}
          onClick={(e) => {
            e.stopPropagation()
            handleSelect(e as React.MouseEvent<HTMLInputElement>)
          }}
          className="relative appearance-none w-4 h-4 mr-2 bg-gray-700 border border-gray-600 rounded cursor-pointer checked:bg-gray-600 checked:after:content-['✓'] checked:after:text-white checked:after:absolute checked:after:text-xs checked:after:flex checked:after:items-center checked:after:justify-center checked:after:inset-0"
        />

        <FontAwesomeIcon
          icon={icon}
          className="mr-2 text-sm opacity-60 cursor-pointer"
          onClick={handleItemClick}
        />

        <span
          className="truncate flex-1 cursor-pointer"
          onClick={handleItemClick}
        >
          {node.name}
        </span>

        {/* {node.url && (
          <span className="text-xs text-gray-400 truncate max-w-32">
            {node.url}
          </span>
        )} */}
      </div>

      {isExpanded && hasChildren && (
        <div className="w-full">
          {node.children?.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              level={level + 1}
              onToggleExpand={onToggleExpand}
              onNodeSelect={onNodeSelect}
              expandedNodes={expandedNodes}
              selectedNodes={selectedNodes}
            />
          ))}
        </div>
      )}
    </div>
  )
}
