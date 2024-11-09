import * as React from "react"
import { useMedia } from "@/hooks/use-media"
import {
  ContentHeader,
  SidebarToggleButton,
} from "@/components/custom/content-header"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { FancySwitch, OptionValue } from "@omit/react-fancy-switch"
import { cn } from "@/lib/utils"
import { LEARNING_STATES, LearningStateValue } from "@/lib/constants"
import { useAtom } from "jotai"
import { linkSortAtom } from "@/store/link"
import { Button } from "@/components/ui/button"
import { LaIcon } from "@/components/custom/la-icon"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const ALL_STATES = [
  { label: "All", value: "all", icon: "List", className: "text-foreground" },
  ...LEARNING_STATES,
]

const LearningTab: React.FC = () => {
  const navigate = useNavigate()
  const { state } = useSearch({ from: "/_layout/_pages/_protected/links/" })

  const handleTabChange = React.useCallback(
    (value: OptionValue) => {
      if (value !== state) {
        navigate({
          to: "/links",
          search: { state: value as LearningStateValue },
        })
      }
    },
    [state, navigate],
  )

  return (
    <FancySwitch
      value={state}
      onChange={handleTabChange}
      options={ALL_STATES}
      className="flex rounded-md"
      highlighterClassName="bg-muted-foreground/10 rounded-md"
      radioClassName={cn(
        "relative mx-2 flex h-6 cursor-pointer items-center justify-center rounded-full px-1 text-sm text-muted-foreground data-[checked]:text-foreground data-[checked]:font-medium transition-colors focus:outline-none",
      )}
      highlighterIncludeMargin={true}
    />
  )
}

const FilterAndSort: React.FC = () => {
  const [sort, setSort] = useAtom(linkSortAtom)
  const [sortOpen, setSortOpen] = React.useState(false)

  const handleSortChange = React.useCallback(
    (value: string) => {
      setSort(value)
      setSortOpen(false)
    },
    [setSort],
  )

  return (
    <div className="flex w-auto items-center justify-end">
      <div className="flex items-center gap-2">
        <DropdownMenu open={sortOpen} onOpenChange={setSortOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 gap-x-2 text-sm max-sm:p-0"
            >
              <LaIcon name="ChevronDown" />
              <span className="hidden md:block">Display</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" side="top">
            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
              Display
            </DropdownMenuLabel>
            <DropdownMenuItem>
              <LaIcon name="List" className="mr-2 h-4 w-4" />
              <span>List</span>
              <LaIcon name="Check" className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
              Ordering
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleSortChange("title")}>
              <span>Title</span>
              {sort === "title" && (
                <LaIcon name="Check" className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortChange("manual")}>
              <span>Manual</span>
              {sort === "manual" && (
                <LaIcon name="Check" className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export const LinkHeader: React.FC = () => {
  const isTablet = useMedia("(max-width: 1024px)")

  return (
    <>
      <ContentHeader>
        <div className="flex min-w-0 shrink-0 items-center gap-1.5">
          <SidebarToggleButton />
          <div className="flex min-h-0 items-center">
            <span className="truncate text-left font-semibold lg:text-lg">
              Links
            </span>
          </div>
        </div>

        {!isTablet && <LearningTab />}

        <div className="flex flex-auto" />

        <FilterAndSort />
      </ContentHeader>

      {isTablet && (
        <div className="flex flex-row items-start justify-between border-b px-6 py-2 max-lg:pl-4">
          <LearningTab />
        </div>
      )}
    </>
  )
}

LinkHeader.displayName = "LinkHeader"
LearningTab.displayName = "LearningTab"
FilterAndSort.displayName = "FilterAndSort"
