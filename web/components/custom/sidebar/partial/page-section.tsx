import React from "react"
import { useAtom } from "jotai"
import { usePathname, useRouter } from "next/navigation"
import { useAccount } from "@/lib/providers/jazz-provider"
import { cn } from "@/lib/utils"
import { atomWithStorage } from "jotai/utils"
import { PersonalPage, PersonalPageLists } from "@/lib/schema/personal-page"
import { Button } from "@/components/ui/button"
import { LaIcon } from "@/components/custom/la-icon"
import { toast } from "sonner"
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

export const PageSection: React.FC = () => {
	const { me } = useAccount({ root: { personalPages: [] } })
	const pageCount = me?.root.personalPages?.length || 0

	return (
		<div className="group/pages flex flex-col gap-px py-2">
			<PageSectionHeader pageCount={pageCount} />
			{me?.root.personalPages && <PageList personalPages={me.root.personalPages} />}
		</div>
	)
}

interface PageSectionHeaderProps {
	pageCount: number
}

const PageSectionHeader: React.FC<PageSectionHeaderProps> = ({ pageCount }) => (
	<div
		className={cn("flex min-h-[30px] items-center gap-px rounded-md", "hover:bg-accent hover:text-accent-foreground")}
	>
		<Button
			variant="ghost"
			className="size-6 flex-1 items-center justify-start rounded-md px-2 py-1 focus-visible:outline-none focus-visible:ring-0"
		>
			<p className="flex items-center text-xs font-medium">
				Pages
				{pageCount && <span className="text-muted-foreground ml-1">{pageCount}</span>}
			</p>
		</Button>
		<div className={cn("flex items-center gap-px pr-2")}>
			<ShowAllForm />
			<NewPageButton />
		</div>
	</div>
)

const NewPageButton: React.FC = () => {
	const { me } = useAccount()
	const router = useRouter()

	const handleClick = () => {
		try {
			const newPersonalPage = PersonalPage.create(
				{ public: false, createdAt: new Date(), updatedAt: new Date() },
				{ owner: me._owner }
			)
			me.root?.personalPages?.push(newPersonalPage)
			router.push(`/pages/${newPersonalPage.id}`)
		} catch (error) {
			toast.error("Failed to create page")
		}
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
}

const PageList: React.FC<PageListProps> = ({ personalPages }) => {
	const pathname = usePathname()

	const [sortCriteria] = useAtom(pageSortAtom)
	const [showCount] = useAtom(pageShowAtom)

	const sortedPages = [...personalPages]
		.sort((a, b) => {
			switch (sortCriteria) {
				case "title":
					return (a?.title ?? "").localeCompare(b?.title ?? "")
				case "recent":
					return (b?.updatedAt?.getTime() ?? 0) - (a?.updatedAt?.getTime() ?? 0)
				default:
					return 0
			}
		})
		.slice(0, showCount === 0 ? personalPages.length : showCount)

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
					"group-hover/sidebar-link:bg-accent group-hover/sidebar-link:text-accent-foreground relative flex h-8 w-full items-center gap-2 rounded-md p-1.5 font-medium",
					{ "bg-accent text-accent-foreground": isActive }
				)}
			>
				<div className="flex max-w-full flex-1 items-center gap-1.5 truncate text-sm">
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

export default PageSection
