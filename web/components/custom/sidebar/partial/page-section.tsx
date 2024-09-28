import React, { useMemo } from "react"
import { useAtom } from "jotai"
import { usePathname, useRouter } from "next/navigation"
import { useAccount } from "@/lib/providers/jazz-provider"
import { cn } from "@/lib/utils"
import { atomWithStorage } from "jotai/utils"
import { PersonalPage, PersonalPageLists } from "@/lib/schema/personal-page"
import { Button } from "@/components/ui/button"
import { LaIcon } from "@/components/custom/la-icon"
import Link from "next/link"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { icons } from "lucide-react"
import { usePageActions } from "@/components/routes/page/hooks/use-page-actions"

type SortOption = "title" | "recent"
type ShowOption = 5 | 10 | 15 | 20 | 0

interface Option<T> {
	label: string
	value: T
}

const SORTS: Option<SortOption>[] = [
	{ label: "Title", value: "title" },
	{ label: "Last edited", value: "recent" }
]

const SHOWS: Option<ShowOption>[] = [
	{ label: "5 items", value: 5 },
	{ label: "10 items", value: 10 },
	{ label: "15 items", value: 15 },
	{ label: "20 items", value: 20 },
	{ label: "All", value: 0 }
]

const pageSortAtom = atomWithStorage<SortOption>("pageSort", "title")
const pageShowAtom = atomWithStorage<ShowOption>("pageShow", 5)

export const PageSection: React.FC<{ pathname?: string }> = ({ pathname }) => {
	const { me } = useAccount({
		root: {
			personalPages: []
		}
	})

	const [sort] = useAtom(pageSortAtom)
	const [show] = useAtom(pageShowAtom)

	if (!me) return null

	const pageCount = me.root.personalPages?.length || 0
	const isActive = pathname === "/pages"

	return (
		<div className="group/pages flex flex-col gap-px py-2">
			<PageSectionHeader pageCount={pageCount} isActive={isActive} />
			<PageList personalPages={me.root.personalPages} sort={sort} show={show} />
		</div>
	)
}

interface PageSectionHeaderProps {
	pageCount: number
	isActive: boolean
}

const PageSectionHeader: React.FC<PageSectionHeaderProps> = ({ pageCount, isActive }) => (
	<div
		className={cn(
			"flex h-9 items-center gap-px rounded-md sm:h-[30px]",
			isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
		)}
	>
		<Link href="/pages" className="flex flex-1 items-center justify-start rounded-md px-2 py-1">
			<p className="text-sm sm:text-xs">
				Pages
				{pageCount > 0 && <span className="text-muted-foreground ml-1">{pageCount}</span>}
			</p>
		</Link>

		<div className="flex items-center gap-px pr-2">
			<ShowAllForm />
			<NewPageButton />
		</div>
	</div>
)

const NewPageButton: React.FC = () => {
	const { me } = useAccount()
	const router = useRouter()
	const { newPage } = usePageActions()

	if (!me) return null

	const handleClick = () => {
		const page = newPage(me)
		router.push(`/pages/${page.id}`)
	}

	return (
		<Button
			type="button"
			variant="ghost"
			aria-label="New Page"
			className={cn(
				"flex size-5 items-center justify-center p-0.5 shadow-none focus-visible:outline-none focus-visible:ring-0",
				"hover:bg-accent-foreground/10",
				"opacity-0 transition-opacity duration-200",
				"group-hover/pages:opacity-100 group-has-[[data-state='open']]/pages:opacity-100 data-[state='open']:opacity-100"
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
	const pathname = usePathname()

	const sortedPages = useMemo(() => {
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
				page => page?.id && <PageListItem key={page.id} page={page} isActive={pathname === `/pages/${page.id}`} />
			)}
		</div>
	)
}

interface PageListItemProps {
	page: PersonalPage
	isActive: boolean
}

const PageListItem: React.FC<PageListItemProps> = ({ page, isActive }) => (
	<div className="group/reorder-page relative">
		<div className="group/sidebar-link relative flex min-w-0 flex-1">
			<Link
				href={`/pages/${page.id}`}
				className={cn(
					"group-hover/sidebar-link:bg-accent group-hover/sidebar-link:text-accent-foreground relative flex h-9 w-full items-center gap-2 rounded-md p-1.5 font-medium sm:h-8",
					{ "bg-accent text-accent-foreground": isActive }
				)}
			>
				<div className="flex max-w-[calc(100%-1rem)] flex-1 items-center gap-1.5 truncate text-sm">
					<LaIcon name="FileText" className="flex-shrink-0 opacity-60" />
					<p className="truncate opacity-95 group-hover/sidebar-link:opacity-100">{page.title || "Untitled"}</p>
				</div>
			</Link>
		</div>
	</div>
)

interface SubMenuProps<T> {
	icon: keyof typeof icons
	label: string
	options: Option<T>[]
	currentValue: T
	onSelect: (value: T) => void
}

const SubMenu = <T extends string | number>({ icon, label, options, currentValue, onSelect }: SubMenuProps<T>) => (
	<DropdownMenuSub>
		<DropdownMenuSubTrigger>
			<span className="flex items-center gap-2">
				<LaIcon name={icon} />
				<span>{label}</span>
			</span>
			<span className="ml-auto flex items-center gap-1">
				<span className="text-muted-foreground text-xs">
					{options.find(option => option.value === currentValue)?.label}
				</span>
				<LaIcon name="ChevronRight" />
			</span>
		</DropdownMenuSubTrigger>
		<DropdownMenuPortal>
			<DropdownMenuSubContent>
				{options.map(option => (
					<DropdownMenuItem key={option.value} onClick={() => onSelect(option.value)}>
						{option.label}
						{currentValue === option.value && <LaIcon name="Check" className="ml-auto" />}
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
						"flex size-5 items-center justify-center p-0.5 shadow-none focus-visible:outline-none focus-visible:ring-0",
						"hover:bg-accent-foreground/10",
						"opacity-0 transition-opacity duration-200",
						"group-hover/pages:opacity-100 group-has-[[data-state='open']]/pages:opacity-100 data-[state='open']:opacity-100"
					)}
				>
					<LaIcon name="Ellipsis" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-56">
				<DropdownMenuGroup>
					<SubMenu<SortOption>
						icon="ArrowUpDown"
						label="Sort"
						options={SORTS}
						currentValue={pagesSorted}
						onSelect={setPagesSorted}
					/>
					<SubMenu<ShowOption>
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
