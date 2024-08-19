import { z } from "zod"
import { useAccount } from "@/lib/providers/jazz-provider"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { PlusIcon } from "lucide-react"
import { cn, generateUniqueSlug } from "@/lib/utils"
import { PersonalPage } from "@/lib/schema/personal-page"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"

const createPageSchema = z.object({
	title: z.string({ message: "Please enter a valid title" }).min(1, { message: "Please enter a valid title" })
})

type PageFormValues = z.infer<typeof createPageSchema>

export const PageSection: React.FC = () => {
	const { me } = useAccount({
		root: { personalPages: [] }
	})
	const pathname = usePathname()

	return (
		<div className="group/pages flex flex-col gap-px py-2">
			<div className="flex items-center gap-px">
				<Button
					variant="ghost"
					className="group size-6 flex-1 items-center justify-start rounded-md px-2 py-1 focus:outline-0 focus:ring-0"
				>
					{/* <span className="mr-1.5 rotate-90 transition-transform duration-200">
						<LaIcon name="ChevronRight" />
					</span> */}
					<p className="text-xs font-medium">Pages</p>
				</Button>
				{me?.root.personalPages && <CreatePageForm />}
			</div>
			<div className="flex flex-col gap-px">
				{me?.root.personalPages.map(
					page =>
						page?.id && (
							<div key={page.id} className="group/reorder-page relative">
								{/* <span className="absolute -left-3 top-1/2 -translate-y-1/2 cursor-move opacity-0 group-hover/reorder-page:opacity-100">
							<LaIcon name="GripVertical" className="size-3.5" />
						</span> */}
								<div className="group/sidebar-link relative flex min-w-0 flex-1">
									<Link
										href={`/pages/${page.id}`}
										className={cn(
											"group-hover/sidebar-link:bg-accent group-hover/sidebar-link:text-accent-foreground relative flex h-8 w-full items-center gap-2 rounded-md p-1.5 font-medium",
											{ "bg-accent text-accent-foreground": pathname === `/pages/${page.id}` }
										)}
									>
										{/* <LaIcon name="NotepadText" /> */}
										<span className="flex max-w-[calc(100%-52px)] flex-1 items-center gap-1.5 truncate text-sm">
											<span className="truncate opacity-85 group-hover/sidebar-link:opacity-100">{page.title}</span>
										</span>
									</Link>
									{/* <Button
								variant="ghost"
								aria-label="Remove"
								className="absolute right-0.5 top-1/2 z-[1] size-6 -translate-y-1/2 p-1 opacity-0 focus:opacity-100 group-hover/sidebar-link:opacity-100"
							>
								<LaIcon name="X" />
							</Button> */}
								</div>
							</div>
						)
				)}
			</div>
		</div>
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
				<Button
					type="button"
					variant="ghost"
					aria-label="New Page"
					className={cn(
						"group flex size-6 items-center justify-center rounded-md p-0.5 focus:outline-0 focus:ring-0"
						// 'opacity-0 group-hover/pages:opacity-100 data-[state="open"]:opacity-100'
					)}
				>
					<PlusIcon size={16} />
				</Button>
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
