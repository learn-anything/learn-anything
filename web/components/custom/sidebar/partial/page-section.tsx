import { z } from "zod"
import { useAtom } from "jotai"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { usePathname, useRouter } from "next/navigation"
import { useAccount } from "@/lib/providers/jazz-provider"
import { cn, generateUniqueSlug } from "@/lib/utils"
import { atomWithStorage } from "jotai/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { PersonalPage, PersonalPageLists } from "@/lib/schema/personal-page"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LaIcon } from "../../la-icon"
import { toast } from "sonner"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const pageSortAtom = atomWithStorage("pageSort", "title")
const createPageSchema = z.object({
	title: z.string({ message: "Please enter a valid title" }).min(1, { message: "Please enter a valid title" })
})

type PageFormValues = z.infer<typeof createPageSchema>

export const PageSection: React.FC = () => {
	const [pagesSorted, setPagesSorted] = useAtom(pageSortAtom)

	const { me } = useAccount({
		root: { personalPages: [] }
	})

	const pageCount = me?.root.personalPages?.length || 0

	const sortedPages = (filter: string) => {
		setPagesSorted(filter)
	}

	return (
		<div className="flex flex-col gap-px py-2">
			<div className="hover:bg-accent group/pages flex items-center gap-px rounded-md">
				<Button
					variant="ghost"
					className="size-6 flex-1 items-center justify-start rounded-md px-2 py-1 focus:outline-0 focus:ring-0"
				>
					<p className="flex items-center text-xs font-medium">
						Pages <span className="text-muted-foreground ml-1">{pageCount}</span>
					</p>
				</Button>
				<div className="flex items-center opacity-0 transition-opacity duration-200 group-hover/pages:opacity-100">
					<ShowAllForm filteredPages={sortedPages} />
					<CreatePageForm />
				</div>
			</div>

			{me?.root.personalPages && <PageList personalPages={me.root.personalPages} sortBy={pagesSorted} />}
		</div>
	)
}

const PageList: React.FC<{ personalPages: PersonalPageLists; sortBy: string }> = ({ personalPages, sortBy }) => {
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
		<div className="flex flex-col gap-1">
			{sortedPages.map(
				page =>
					page?.id && (
						<div key={page.id} className="group/reorder-page relative">
							<div className="group/sidebar-link relative flex min-w-0 flex-1">
								<Link
									href={`/pages/${page.id}`}
									className={cn(
										"group-hover/sidebar-link:bg-accent group-hover/sidebar-link:text-accent-foreground relative flex h-8 w-full items-center gap-2 rounded-md p-1.5 font-medium",
										{ "bg-accent text-accent-foreground": pathname === `/pages/${page.id}` }
									)}
								>
									<div className="flex max-w-full flex-1 items-center gap-1.5 truncate text-sm">
										<LaIcon name="FileText" className="size-3 flex-shrink-0 opacity-60" />
										<p className="truncate opacity-95 group-hover/sidebar-link:opacity-100">{page.title}</p>
									</div>
								</Link>
							</div>
						</div>
					)
			)}
		</div>
	)
}

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
				<Button variant="ghost" size="sm" className="h-8 px-2 text-xs font-medium">
					<LaIcon name="Ellipsis" className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-[100px]">
				<DropdownMenuItem onClick={() => handleSort("title")}>
					Title
					{pagesSorted === "title" && <LaIcon name="Check" className="ml-auto h-4 w-4" />}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleSort("manual")}>
					Manual
					{pagesSorted === "manual" && <LaIcon name="Check" className="ml-auto h-4 w-4" />}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

const CreatePageForm: React.FC = () => {
	const [open, setOpen] = useState(false)
	const { me } = useAccount()
	const route = useRouter()

	const form = useForm<PageFormValues>({
		resolver: zodResolver(createPageSchema),
		defaultValues: {
			title: ""
		}
	})

	const onSubmit = (values: PageFormValues) => {
		try {
			const personalPages = me?.root?.personalPages?.toJSON() || []
			const slug = generateUniqueSlug(personalPages, values.title)

			const newPersonalPage = PersonalPage.create(
				{
					title: values.title,
					slug: slug,
					content: ""
				},
				{ owner: me._owner }
			)

			me.root?.personalPages?.push(newPersonalPage)

			form.reset()
			setOpen(false)

			route.push(`/pages/${newPersonalPage.id}`)
		} catch (error) {
			console.error(error)
			toast.error("Failed to create page")
		}
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					type="button"
					aria-label="New Page"
					className={cn(
						"flex size-6 cursor-pointer items-center justify-center rounded-lg bg-inherit p-0.5 shadow-none focus:outline-0 focus:ring-0",
						'opacity-0 transition-opacity duration-200 group-hover/pages:opacity-100 data-[state="open"]:opacity-100'
					)}
				>
					<LaIcon name="Plus" className="text-black dark:text-white" />
				</button>
			</PopoverTrigger>
			<PopoverContent align="start">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>New page</FormLabel>
									<FormControl>
										<Input placeholder="Enter a title" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" size="sm" className="w-full">
							Create page
						</Button>
					</form>
				</Form>
			</PopoverContent>
		</Popover>
	)
}
