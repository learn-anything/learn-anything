import * as React from "react"
import { useAccount, useCoState } from "@/lib/providers/jazz-provider"
import { PersonalLink } from "@/lib/schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { createLinkSchema, LinkFormValues } from "./schema"
import { generateUniqueSlug } from "@/lib/utils"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { UrlInput } from "./partial/url-input"
import { UrlBadge } from "./partial/url-badge"
import { TitleInput } from "./partial/title-input"
import { NotesSection } from "./partial/notes-section"
import { TopicSelector } from "./partial/topic-selector"
import { DescriptionInput } from "./partial/description-input"
import { LearningStateSelector } from "./partial/learning-state-selector"

interface LinkFormProps extends React.ComponentPropsWithoutRef<"form"> {
	onSuccess?: () => void
	onCancel?: () => void
	personalLink?: PersonalLink
}

const defaultValues: Partial<LinkFormValues> = {
	url: "",
	icon: "",
	title: "",
	description: "",
	completed: false,
	notes: "",
	learningState: "wantToLearn",
	topic: null
}

export const LinkForm = React.forwardRef<HTMLFormElement, LinkFormProps>(
	({ onSuccess, onCancel, personalLink }, ref) => {
		const [isFetching, setIsFetching] = React.useState(false)
		const [urlFetched, setUrlFetched] = React.useState<string | null>(null)
		const { me } = useAccount()
		const selectedLink = useCoState(PersonalLink, personalLink?.id)

		const form = useForm<LinkFormValues>({
			resolver: zodResolver(createLinkSchema),
			defaultValues,
			mode: "all"
		})

		React.useEffect(() => {
			if (selectedLink) {
				setUrlFetched(selectedLink.url)
				form.reset({
					url: selectedLink.url,
					icon: selectedLink.icon,
					title: selectedLink.title,
					description: selectedLink.description,
					completed: selectedLink.completed,
					notes: selectedLink.notes,
					learningState: selectedLink.learningState
				})
			}
		}, [selectedLink, form])

		const fetchMetadata = async (url: string) => {
			setIsFetching(true)
			try {
				const res = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`, { cache: "force-cache" })
				const data = await res.json()
				setUrlFetched(data.url)
				form.setValue("icon", data.icon)
				form.setValue("title", data.title)
				if (!form.getValues("description")) form.setValue("description", data.description)
				form.setFocus("title")
			} catch (err) {
				console.error("Failed to fetch metadata", err)
			} finally {
				setIsFetching(false)
			}
		}

		const onSubmit = (values: LinkFormValues) => {
			if (isFetching) return
			try {
				const personalLinks = me.root?.personalLinks?.toJSON() || []
				const slug = generateUniqueSlug(personalLinks, values.title)

				if (selectedLink) {
					selectedLink.applyDiff({ ...values, slug, topic: null })
				} else {
					const newPersonalLink = PersonalLink.create(
						{
							...values,
							slug,
							topic: null,
							sequence: me.root?.personalLinks?.length || 1,
							createdAt: new Date(),
							updatedAt: new Date()
						},
						{ owner: me._owner }
					)
					me.root?.personalLinks?.push(newPersonalLink)
				}
				form.reset(defaultValues)
				onSuccess?.()
			} catch (error) {
				console.error("Failed to create/update link", error)
				toast.error(personalLink ? "Failed to update link" : "Failed to create link")
			}
		}

		const handleCancel = () => {
			form.reset(defaultValues)
			onCancel?.()
		}

		const handleResetUrl = () => {
			setUrlFetched(null)
			form.setFocus("url")
			form.reset({ url: "", title: "", icon: "", description: "" })
		}

		return (
			<div className="p-3 transition-all">
				<div className="bg-muted/30 rounded-md border">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="relative min-w-0 flex-1" ref={ref}>
							<div className="flex flex-col gap-1.5 p-3">
								<div className="flex flex-row items-start justify-between">
									<UrlInput urlFetched={urlFetched} fetchMetadata={fetchMetadata} />
									<TitleInput urlFetched={urlFetched} />

									<div className="flex flex-row items-center gap-2">
										<LearningStateSelector />
										<TopicSelector />
									</div>
								</div>

								<DescriptionInput />
								<UrlBadge urlFetched={urlFetched} handleResetUrl={handleResetUrl} />
							</div>

							<div className="flex flex-row items-center justify-between gap-2 rounded-b-md border-t px-3 py-2">
								<NotesSection />

								<div className="flex w-auto items-center justify-end gap-x-2">
									<Button size="sm" type="button" variant="ghost" onClick={handleCancel}>
										Cancel
									</Button>
									<Button size="sm" type="submit">
										Save
									</Button>
								</div>
							</div>
						</form>
					</Form>
				</div>
			</div>
		)
	}
)

LinkForm.displayName = "LinkForm"
