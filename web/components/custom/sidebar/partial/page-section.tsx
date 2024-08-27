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

const pageSortAtom = atomWithStorage("pageSort", "title")

export const PageSection: React.FC = () => {
	const [pagesSorted, setPagesSorted] = useAtom(pageSortAtom)
	const { me } = useAccount({ root: { personalPages: [] } })
	const pageCount = me?.root.personalPages?.length || 0

	const sortPages = (filter: string) => setPagesSorted(filter)

	return (
		<div className="group/pages flex flex-col gap-px py-2">
			<PageSectionHeader pageCount={pageCount} sortPages={sortPages} />
			{me?.root.personalPages && <PageList personalPages={me.root.personalPages} sortBy={pagesSorted} />}
		</div>
	)
}

interface PageSectionHeaderProps {
	pageCount: number
	sortPages: (filter: string) => void
}

const PageSectionHeader: React.FC<PageSectionHeaderProps> = ({ pageCount, sortPages }) => (
	<div
		className={cn("flex min-h-[30px] items-center gap-px rounded-md", "hover:bg-accent hover:text-accent-foreground")}
	>
		<Button
			variant="ghost"
			className="size-6 flex-1 items-center justify-start rounded-md px-2 py-1 focus-visible:outline-none focus-visible:ring-0"
		>
			<p className="flex items-center text-xs font-medium">
				Pages <span className="text-muted-foreground ml-1">{pageCount}</span>
			</p>
		</Button>
		<div className={cn("flex items-center gap-px pr-2")}>
			<ShowAllForm filteredPages={sortPages} />
			<NewPageButton />
		</div>
	</div>
)

const NewPageButton: React.FC = () => {
	const { me } = useAccount()
	const router = useRouter()

	const handleClick = () => {
		try {
			const newPersonalPage = PersonalPage.create({ public: false }, { owner: me._owner })
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
	sortBy: string
}

const PageList: React.FC<PageListProps> = ({ personalPages, sortBy }) => {
	const pathname = usePathname()

	const sortedPages = [...personalPages]
		.sort((a, b) => {
			if (sortBy === "title") {
				return (a?.title || "").localeCompare(b?.title || "")
			} else if (sortBy === "latest") {
				return ((b as any)?.createdAt?.getTime?.() ?? 0) - ((a as any)?.createdAt?.getTime?.() ?? 0)
			}
			return 0
		})
		.slice(0, 6)

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
					<LaIcon name="FileText" className="size-3 flex-shrink-0 opacity-60" />
					<p className="truncate opacity-95 group-hover/sidebar-link:opacity-100">{page.title || "Untitled"}</p>
				</div>
			</Link>
		</div>
	</div>
)

interface ShowAllFormProps {
	filteredPages: (filter: string) => void
}

const ShowAllForm: React.FC<ShowAllFormProps> = ({ filteredPages }) => {
	const [pagesSorted, setPagesSorted] = useAtom(pageSortAtom)

	const handleSort = (newSort: string) => {
		setPagesSorted(newSort.toLowerCase())
		filteredPages(newSort.toLowerCase())
	}

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
				<DropdownMenuItem onClick={() => handleSort("title")}>
					Title
					{pagesSorted === "title" && <LaIcon name="Check" className="ml-auto h-4 w-4" />}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleSort("manual")}>
					Manual
					{pagesSorted === "manual" && <LaIcon name="Check" className="ml-auto h-4 w-4" />}
				</DropdownMenuItem>

				<DropdownMenuGroup>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<span className="flex items-center gap-2">
								<LaIcon name="ArrowUpDown" />
								<span>Sort</span>
							</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuItem>Title</DropdownMenuItem>
								<DropdownMenuItem>Last edited</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<span className="flex items-center gap-2">
								<LaIcon name="Hash" />
								<span>Show</span>
							</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuItem>Title</DropdownMenuItem>
								<DropdownMenuItem>Last edited</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default PageSection
