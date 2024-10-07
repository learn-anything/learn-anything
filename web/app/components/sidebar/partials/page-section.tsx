import * as React from "react"
import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { Link, useNavigate } from "@tanstack/react-router"
import { useAccount } from "@/lib/providers/jazz-provider"
import { cn } from "@/lib/utils"
import { PersonalPage, PersonalPageLists } from "@/lib/schema/personal-page"
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

export const PageSection: React.FC = () => {
  const { me } = useAccount({
    root: {
      personalPages: [],
    },
  })
  const [sort] = useAtom(pageSortAtom)
  const [show] = useAtom(pageShowAtom)

  if (!me) return null

  const pageCount = me.root.personalPages?.length || 0

  return (
    <div className="group/pages flex flex-col gap-px py-2">
      <PageSectionHeader pageCount={pageCount} />
      <PageList personalPages={me.root.personalPages} sort={sort} show={show} />
    </div>
  )
}

interface PageSectionHeaderProps {
  pageCount: number
}

const PageSectionHeader: React.FC<PageSectionHeaderProps> = ({ pageCount }) => (
  <Link
    to="/pages"
    className={cn(
      "flex h-9 flex-1 items-center justify-start gap-px rounded-md px-2 py-1",
      "hover:bg-accent hover:text-accent-foreground sm:h-[30px]",
    )}
    activeProps={{
      className: "bg-accent text-accent-foreground",
    }}
  >
    <div className="flex grow items-center justify-between">
      <p className="text-sm sm:text-xs">
        Pages
        {pageCount > 0 && (
          <span className="text-muted-foreground ml-1">{pageCount}</span>
        )}
      </p>
      <div className="flex items-center gap-px">
        <ShowAllForm />
        <NewPageButton />
      </div>
    </div>
  </Link>
)

const NewPageButton: React.FC = () => {
  const { me } = useAccount()
  const navigate = useNavigate()
  const { newPage } = usePageActions()

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const page = newPage(me)

    if (page.id) {
      navigate({
        to: "/pages/$pageId",
        params: { pageId: page.id },
        replace: true,
      })
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      aria-label="New Page"
      className={cn(
        "flex size-5 items-center justify-center p-0.5 shadow-none",
        "hover:bg-accent-foreground/10",
        "opacity-0 transition-opacity duration-200",
        "group-hover/pages:opacity-100 group-has-[[data-state='open']]/pages:opacity-100",
        "data-[state='open']:opacity-100 focus-visible:outline-none focus-visible:ring-0",
      )}
      onClick={handleClick}
    >
      <LaIcon name="Plus" />
    </Button>
  )
}

interface PageListProps {
  personalPages: PersonalPageLists
  sort: SortOption
  show: ShowOption
}

const PageList: React.FC<PageListProps> = ({ personalPages, sort, show }) => {
  const sortedPages = React.useMemo(() => {
    return [...personalPages]
      .sort((a, b) => {
        if (sort === "title") {
          return (a?.title ?? "").localeCompare(b?.title ?? "")
        }
        return (b?.updatedAt?.getTime() ?? 0) - (a?.updatedAt?.getTime() ?? 0)
      })
      .slice(0, show === 0 ? personalPages.length : show)
  }, [personalPages, sort, show])

  return (
    <div className="flex flex-col gap-px">
      {sortedPages.map(
        (page) => page?.id && <PageListItem key={page.id} page={page} />,
      )}
    </div>
  )
}

interface PageListItemProps {
  page: PersonalPage
}

const PageListItem: React.FC<PageListItemProps> = ({ page }) => {
  return (
    <div className="group/reorder-page relative">
      <div className="group/sidebar-link relative flex min-w-0 flex-1">
        <Link
          to="/pages/$pageId"
          params={{ pageId: page.id }}
          className={cn(
            "relative flex h-9 w-full items-center gap-2 rounded-md p-1.5 font-medium sm:h-8",
            "group-hover/sidebar-link:bg-accent group-hover/sidebar-link:text-accent-foreground",
          )}
          activeOptions={{ exact: true }}
          activeProps={{
            className: "bg-accent text-accent-foreground",
          }}
        >
          <div className="flex max-w-[calc(100%-1rem)] flex-1 items-center gap-1.5 truncate text-sm">
            <LaIcon name="FileText" className="flex-shrink-0 opacity-60" />
            <p className="truncate opacity-95 group-hover/sidebar-link:opacity-100">
              {page.title || "Untitled"}
            </p>
          </div>
        </Link>
      </div>
    </div>
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
        <LaIcon name={icon} />
        <span>{label}</span>
      </span>
      <span className="ml-auto flex items-center gap-1">
        <span className="text-muted-foreground text-xs">
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
            "flex size-5 items-center justify-center p-0.5 shadow-none",
            "hover:bg-accent-foreground/10",
            "opacity-0 transition-opacity duration-200",
            "group-hover/pages:opacity-100 group-has-[[data-state='open']]/pages:opacity-100",
            "data-[state='open']:opacity-100 focus-visible:outline-none focus-visible:ring-0",
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
