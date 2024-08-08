import { SidebarItem } from "../sidebar"
import { z } from "zod"
import { useAccount } from "@/lib/providers/jazz-provider"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { PlusIcon } from "lucide-react"
import { generateUniqueSlug } from "@/lib/utils"
import { PersonalPage } from "@/lib/schema/personal-page"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useRouter } from "next/navigation"

const createPageSchema = z.object({
	title: z.string({ message: "Please enter a valid title" }).min(1, { message: "Please enter a valid title" })
})

type PageFormValues = z.infer<typeof createPageSchema>

export const PageSection: React.FC = () => {
	const { me } = useAccount()
	const personalPages = me.root?.personalPages || []

	return (
		<div className="-ml-2">
			<div className="group mb-0.5 ml-2 mt-2 flex flex-row items-center justify-between rounded-md">
				<div
					role="button"
					tabIndex={0}
					className="text-muted-foreground hover:bg-muted/50 flex h-6 grow cursor-default items-center justify-between gap-x-0.5 self-start rounded-md px-1 text-xs font-medium"
				>
					<span className="group-hover:text-muted-foreground">Pages</span>
					<CreatePageForm />
				</div>
			</div>

			<div className="relative shrink-0">
				<div aria-hidden="false" className="ml-2 shrink-0 pb-2">
					{personalPages.map(
						page => page && <SidebarItem key={page.id} url={`/pages/${page.id}`} label={page.title} />
					)}
				</div>
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

			toast.success("Page created successfully")
		} catch (error) {
			console.error(error)
			toast.error("Failed to create page")
		}
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button type="button" size="icon" variant="ghost" aria-label="New Page" className="size-6">
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
