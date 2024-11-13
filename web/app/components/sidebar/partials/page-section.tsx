import * as React from "react"
import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { Link } from "@tanstack/react-router"
import { useAccount } from "@/lib/providers/jazz-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LaIcon } from "@/components/custom/la-icon"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePageActions } from "~/hooks/actions/use-page-actions"
import { icons } from "lucide-react"
import { ArrowIcon } from "~/components/icons/arrow-icon"

type SortOption = "title" | "recent"
type ShowOption = 5 | 10 | 15 | 20 | 0

interface Option<T> {
  label: string
  value: T
}

const SORTS: Option<SortOption>[] = [
  { label: "Title", value: "title" },
  { label: "Last edited", value: "recent" },
]

const SHOWS: Option<ShowOption>[] = [
  { label: "5 items", value: 5 },
  { label: "10 items", value: 10 },
  { label: "15 items", value: 15 },
  { label: "20 items", value: 20 },
  { label: "All", value: 0 },
]

const pageSortAtom = atomWithStorage<SortOption>("pageSort", "title")
const pageShowAtom = atomWithStorage<ShowOption>("pageShow", 5)
const isExpandedAtom = atomWithStorage("isPageSectionExpanded", true)

export const PageSection: React.FC = () => {
  const { me } = useAccount({
    root: {
      personalPages: [{}],
    },
  })

  const [sort] = useAtom(pageSortAtom)
  const [show] = useAtom(pageShowAtom)
  const [isExpanded, setIsExpanded] = useAtom(isExpandedAtom)

  const pageCount = me?.root.personalPages.length || 0
  const personalPages = me?.root.personalPages ?? []
  const sortedPages = [...personalPages]
    .sort((a, b) => {
      if (sort === "title") {
        return (a?.title ?? "").localeCompare(b?.title ?? "")
      }
      return (b?.updatedAt?.getTime() ?? 0) - (a?.updatedAt?.getTime() ?? 0)
    })
    .slice(0, show === 0 ? personalPages.length : show)

  return (
    <div className="flex flex-col gap-px py-2">
      <PageSectionHeader
        pageCount={pageCount}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      />
      {isExpanded && (
        <div className="flex flex-col gap-px">
          {sortedPages.map((page, index) => (
            <Link
              key={index}
              to="/pages/$pageId"
              params={{ pageId: page.id }}
              className={cn(
                "group/p cursor-default text-[var(--less-foreground)]",
                "relative flex h-[30px] w-full items-center gap-2 rounded-md px-1.5 text-sm font-medium hover:bg-[var(--item-hover)]",
              )}
              activeOptions={{ exact: true }}
              activeProps={{
                className:
                  "bg-[var(--item-active)] data-[status='active']:hover:bg-[var(--item-active)]",
              }}
            >
              {({ isActive }) => (
                <div className="flex max-w-full flex-1 items-center gap-1.5 truncate">
                  <LaIcon
                    name="File"
                    className={cn(
                      "flex-shrink-0 group-hover/p:text-foreground",
                      {
                        "text-foreground": isActive,
                        "text-muted-foreground": !isActive,
                      },
                    )}
                  />
                  <p className="truncate">{page.title || "Untitled"}</p>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

interface PageSectionHeaderProps {
  pageCount: number
  isExpanded: boolean
  onToggle: () => void
}

const PageSectionHeader: React.FC<PageSectionHeaderProps> = ({
  pageCount,
  isExpanded,
  onToggle,
}) => (
  <div
    className={cn(
      "group/pages",
      "relative flex h-7 cursor-default items-center gap-px rounded-md py-0 font-medium text-muted-foreground hover:bg-[var(--item-hover)] focus-visible:outline-none focus-visible:ring-0",
    )}
  >
    <Button
      variant="ghost"
      className="h-7 w-full justify-start gap-1 px-2 py-0 text-xs hover:bg-inherit"
      onClick={onToggle}
    >
      <span>Pages</span>
      {pageCount > 0 && <span className="text-xs">({pageCount})</span>}
      <ArrowIcon
        className={cn("size-3 transition-transform duration-200 ease-in-out", {
          "rotate-90": isExpanded,
          "opacity-0 group-hover/pages:opacity-100": !isExpanded,
        })}
      />
    </Button>
    <div
      className={cn(
        "absolute right-1 top-1/2 -translate-y-1/2",
        "transition-all duration-200 ease-in-out",
        {
          "opacity-100": isExpanded,
        },
      )}
    >
      <div className="flex items-center gap-px">
        <ShowAllForm />
        <NewPageButton />
      </div>
    </div>
  </div>
)

const NewPageButton: React.FC = () => {
  const { createNewPage } = usePageActions()

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    createNewPage()
  }

  return (
    <Button
      type="button"
      variant="ghost"
      aria-label="New Page"
      className={cn(
        "flex size-5 cursor-default items-center justify-center p-0.5 shadow-none",
        "text-muted-foreground hover:bg-inherit hover:text-foreground",
        "opacity-0 transition-opacity duration-200",
        "group-hover/pages:opacity-100 group-has-[[data-state='open']]/pages:opacity-100",
        "focus-visible:outline-none focus-visible:ring-0 data-[state='open']:opacity-100",
      )}
      onClick={handleClick}
    >
      <LaIcon name="Plus" />
    </Button>
  )
}

interface SubMenuProps<T> {
  icon: keyof typeof icons
  label: string
  options: Option<T>[]
  currentValue: T
  onSelect: (value: T) => void
}

const SubMenu = <T extends string | number>({
  icon,
  label,
  options,
  currentValue,
  onSelect,
}: SubMenuProps<T>) => (
  <DropdownMenuSub>
    <DropdownMenuSubTrigger>
      <span className="flex items-center gap-2">
        <LaIcon name={icon} className="" />
        <span>{label}</span>
      </span>
      <span className="ml-auto flex items-center gap-1">
        <span className="text-sm text-muted-foreground">
          {options.find((option) => option.value === currentValue)?.label}
        </span>
        <LaIcon name="ChevronRight" />
      </span>
    </DropdownMenuSubTrigger>
    <DropdownMenuPortal>
      <DropdownMenuSubContent>
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onSelect(option.value)}
          >
            {option.label}
            {currentValue === option.value && (
              <LaIcon name="Check" className="ml-auto" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuPortal>
  </DropdownMenuSub>
)

const ShowAllForm: React.FC = () => {
  const [pagesSorted, setPagesSorted] = useAtom(pageSortAtom)
  const [pagesShow, setPagesShow] = useAtom(pageShowAtom)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex size-5 cursor-default items-center justify-center p-0.5 shadow-none",
            "text-muted-foreground hover:bg-inherit hover:text-foreground",
            "opacity-0 transition-opacity duration-200",
            "group-hover/pages:opacity-100 group-has-[[data-state='open']]/pages:opacity-100",
            "focus-visible:outline-none focus-visible:ring-0 data-[state='open']:opacity-100",
          )}
        >
          <LaIcon name="Ellipsis" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuGroup>
          <SubMenu
            icon="ArrowUpDown"
            label="Sort"
            options={SORTS}
            currentValue={pagesSorted}
            onSelect={setPagesSorted}
          />
          <SubMenu
            icon="Hash"
            label="Show"
            options={SHOWS}
            currentValue={pagesShow}
            onSelect={setPagesShow}
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
