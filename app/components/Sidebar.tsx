import { useState, useEffect } from "react"
import Tree from "./Tree"
import { WebsiteElement } from "./TreeItem"
import { cn } from "~/lib/utils"
import { testData, sortElements, filterElements } from "~/data/testData"
import Filters from "./Filters"
import ResizablePanel from "./ResizablePanel"

type SidebarProps = {
  className?: string
  onAnalyzeSelection?: (selectedElements: WebsiteElement[]) => void
  width?: number
  onWidthChange?: (width: number) => void
}

export default function Sidebar({
  className,
  onAnalyzeSelection,
  width = 250,
  onWidthChange,
}: SidebarProps) {
  const [initialized, setInitialized] = useState(false)
  const [selectedElements, setSelectedElements] = useState<WebsiteElement[]>([])
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null)
  const [filterType, setFilterType] = useState<string | null>(null)
  const [data, setData] = useState<WebsiteElement[]>(testData)
  const [originalData] = useState<WebsiteElement[]>(
    JSON.parse(JSON.stringify(testData)),
  )

  const selectionChange = (elements: WebsiteElement[]) => {
    setSelectedElements(elements)
  }

  const applySorting = (order: "asc" | "desc" | null) => {
    setSortOrder(order)

    if (order === null) {
      setData(JSON.parse(JSON.stringify(originalData)))
      return
    }

    const sortedData = JSON.parse(JSON.stringify(data)) as WebsiteElement[]
    setData(sortedData.length > 0 ? sortElements(sortedData, order) : [])
  }

  const applyFilter = (type: string | null) => {
    setFilterType(type)

    if (type === null) {
      setData(JSON.parse(JSON.stringify(originalData)))
      return
    }

    const dataToFilter = JSON.parse(
      JSON.stringify(originalData),
    ) as WebsiteElement[]

    setData(filterElements(dataToFilter, type))
  }

  const clearFilters = () => {
    setSortOrder(null)
    setFilterType(null)
    setData(JSON.parse(JSON.stringify(originalData)))
  }

  useEffect(() => {
    if (initialized && onAnalyzeSelection) {
      onAnalyzeSelection(selectedElements)
    }
  }, [initialized, onAnalyzeSelection, selectedElements])

  return (
    <ResizablePanel
      width={width}
      onWidthChange={onWidthChange}
      className={cn(
        "bg-sidebar-background text-sidebar-foreground border-r border-white/10 h-full overflow-y-auto flex flex-col",
        className,
      )}
    >
      <div className="p-4 flex-1 overflow-auto">
        <Filters
          sortOrder={sortOrder}
          filterType={filterType}
          onSort={applySorting}
          onFilter={applyFilter}
          onClear={clearFilters}
        />

        <Tree data={data} onSelectionChange={selectionChange} />
      </div>
    </ResizablePanel>
  )
}
