import { useState, useEffect } from "react"
import { cn } from "~/lib/utils"
import { elementTypes } from "~/data/testData"

type FiltersProps = {
  sortOrder: "asc" | "desc" | null
  filterType: string | null
  onSort: (order: "asc" | "desc" | null) => void
  onFilter: (type: string | null) => void
  onClear: () => void
}

export default function Filters({
  sortOrder,
  filterType,
  onSort,
  onFilter,
  onClear,
}: FiltersProps) {
  const [showSortModal, setShowSortModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const sortButton = document.getElementById("sort-button")
      const filterButton = document.getElementById("filter-button")
      const sortModal = document.getElementById("sort-modal")
      const filterModal = document.getElementById("filter-modal")

      if (
        showSortModal &&
        sortModal &&
        !sortModal.contains(target) &&
        sortButton &&
        !sortButton.contains(target)
      ) {
        setShowSortModal(false)
      }

      if (
        showFilterModal &&
        filterModal &&
        !filterModal.contains(target) &&
        filterButton &&
        !filterButton.contains(target)
      ) {
        setShowFilterModal(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showSortModal, showFilterModal])

  const toggleSortModal = () => {
    setShowSortModal(!showSortModal)
    setShowFilterModal(false)
  }

  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal)
    setShowSortModal(false)
  }

  const applySorting = (order: "asc" | "desc") => {
    if (order === sortOrder) {
      onSort(null as any)
    } else {
      onSort(order)
    }
    setShowSortModal(false)
  }

  const applyFilter = (type: string | null) => {
    if (type === filterType) {
      onFilter(null)
    } else {
      onFilter(type)
    }
    setShowFilterModal(false)
  }

  return (
    <>
      <div className="flex flex-row items-center space-x-2 mb-4">
        <button
          id="sort-button"
          onClick={toggleSortModal}
          className={cn(
            "px-3 py-2 text-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-colors",
            sortOrder && "bg-white/10",
          )}
        >
          Sort
        </button>
        <button
          id="filter-button"
          onClick={toggleFilterModal}
          className={cn(
            "px-3 py-2 text-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-colors",
            filterType && "bg-white/10",
          )}
        >
          Filter
        </button>
        <button
          onClick={onClear}
          className="px-3 py-2 text-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-colors"
        >
          Clear
        </button>
      </div>

      {showSortModal && (
        <div
          id="sort-modal"
          className="mb-4 p-3 bg-[#2b2b2bb9] backdrop-blur-sm rounded-2xl absolute z-10"
        >
          <h3 className="text-sm font-medium mb-2">Sort elements</h3>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => applySorting("asc")}
              className={cn(
                "text-left px-3 py-2 text-sm rounded-xl hover:bg-white/5 transition-colors",
                sortOrder === "asc" && "bg-white/10",
              )}
            >
              A to Z (ascending)
            </button>
            <button
              onClick={() => applySorting("desc")}
              className={cn(
                "text-left px-3 py-2 text-sm rounded-xl hover:bg-white/5 transition-colors",
                sortOrder === "desc" && "bg-white/10",
              )}
            >
              Z to A (descending)
            </button>
          </div>
        </div>
      )}

      {showFilterModal && (
        <div
          id="filter-modal"
          className="mb-4 p-3 bg-[#2b2b2bb9] backdrop-blur-sm rounded-2xl absolute z-10"
        >
          <h3 className="text-sm font-medium mb-2">Filter by type</h3>
          <div className="flex flex-col space-y-2">
            {elementTypes.map((type) => (
              <button
                key={type}
                onClick={() => applyFilter(type)}
                className={cn(
                  "text-left px-3 py-2 text-sm rounded-xl hover:bg-white/5 transition-colors",
                  filterType === type && "bg-white/10",
                )}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
            <button
              onClick={() => applyFilter(null)}
              className="text-left px-3 py-2 text-sm rounded-xl hover:bg-white/5 transition-colors"
            >
              Show all
            </button>
          </div>
        </div>
      )}

      {filterType && (
        <div className="mb-3 px-3 py-2 bg-[#2b2b2bb9] backdrop-blur-sm rounded-xl text-xs inline-block">
          Filter: <span className="font-semibold">{filterType}</span>
          <button
            onClick={() => applyFilter(null)}
            className="ml-2 text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
      )}
    </>
  )
}
