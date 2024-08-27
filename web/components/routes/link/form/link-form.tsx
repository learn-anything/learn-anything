import * as React from "react"
import { useAccount, useCoState } from "@/lib/providers/jazz-provider"
import { PersonalLink, Topic } from "@/lib/schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { createLinkSchema, LinkFormValues } from "./schema"
import { cn, generateUniqueSlug } from "@/lib/utils"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { UrlInput } from "./partial/url-input"
import { UrlBadge } from "./partial/url-badge"
import { TitleInput } from "./partial/title-input"
import { NotesSection } from "./partial/notes-section"
import { TopicSelector } from "./partial/topic-selector"
import { DescriptionInput } from "./partial/description-input"
import { atom, useAtom } from "jotai"
import { linkLearningStateSelectorAtom, linkTopicSelectorAtom } from "@/store/link"
import { FormField, FormItem, FormLabel } from "@/components/ui/form"
import { LearningStateSelector } from "@/components/custom/learning-state-selector"

export const globalLinkFormExceptionRefsAtom = atom<React.RefObject<HTMLElement>[]>([])
interface LinkFormProps extends React.ComponentPropsWithoutRef<"form"> {
	onClose?: () => void
	onSuccess?: () => void
	onFail?: () => void
	personalLink?: PersonalLink
	exceptionsRefs?: React.RefObject<HTMLElement>[]
}

const defaultValues: Partial<LinkFormValues> = {
	url: "",
	icon: "",
	title: "",
	description: "",
	completed: false,
	notes: "",
	learningState: undefined,
	topic: null
}

export const LinkForm: React.FC<LinkFormProps> = ({
	onSuccess,
	onFail,
	personalLink,
	onClose,
	exceptionsRefs = []
}) => {
	const [selectedTopic, setSelectedTopic] = React.useState<Topic | undefined>()
	const [istopicSelectorOpen] = useAtom(linkTopicSelectorAtom)
	const [islearningStateSelectorOpen] = useAtom(linkLearningStateSelectorAtom)
	const [globalExceptionRefs] = useAtom(globalLinkFormExceptionRefsAtom)

	const formRef = React.useRef<HTMLFormElement>(null)

	const [isFetching, setIsFetching] = React.useState(false)
	const [urlFetched, setUrlFetched] = React.useState<string | null>(null)
	const { me } = useAccount()
	const selectedLink = useCoState(PersonalLink, personalLink?.id)

	const form = useForm<LinkFormValues>({
		resolver: zodResolver(createLinkSchema),
		defaultValues,
		mode: "all"
	})

	const allExceptionRefs = React.useMemo(
		() => [...exceptionsRefs, ...globalExceptionRefs],
		[exceptionsRefs, globalExceptionRefs]
	)

	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const isClickInsideForm = formRef.current && formRef.current.contains(event.target as Node)

			const isClickInsideExceptions = allExceptionRefs.some((ref, index) => {
				const isInside = ref.current && ref.current.contains(event.target as Node)
				return isInside
			})

			if (!isClickInsideForm && !istopicSelectorOpen && !islearningStateSelectorOpen && !isClickInsideExceptions) {
				onClose?.()
			}
		}

		document.addEventListener("mousedown", handleClickOutside)

		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [islearningStateSelectorOpen, istopicSelectorOpen, allExceptionRefs, onClose])

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
			const res = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`, { cache: "no-cache" })
			const data = await res.json()
			setUrlFetched(data.url)
			form.setValue("url", data.url, {
				shouldValidate: true
			})
			form.setValue("icon", data.icon ?? "", {
				shouldValidate: true
			})
			form.setValue("title", data.title, {
				shouldValidate: true
			})
			if (!form.getValues("description"))
				form.setValue("description", data.description, {
					shouldValidate: true
				})
			form.setFocus("title")
			console.log(form.formState.isValid, "form state after....")
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
				const { topic, ...diffValues } = values

				if (!selectedTopic) {
					selectedLink.applyDiff({ ...diffValues, slug, updatedAt: new Date() })
				} else {
					selectedLink.applyDiff({ ...values, slug, topic: selectedTopic })
				}
			} else {
				const newPersonalLink = PersonalLink.create(
					{
						...values,
						slug,
						topic: selectedTopic,
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
			onFail?.()
			console.error("Failed to create/update link", error)
			toast.error(personalLink ? "Failed to update link" : "Failed to create link")
		}
	}

	const handleCancel = () => {
		form.reset(defaultValues)
		onClose?.()
	}

	const handleResetUrl = () => {
		setUrlFetched(null)
		form.setFocus("url")
		form.reset({ url: "", title: "", icon: "", description: "" })
	}

	const canSubmit = form.formState.isValid && !form.formState.isSubmitting

	return (
		<div className="p-3 transition-all">
			<div className={cn("bg-muted/30 relative rounded-md border", isFetching && "opacity-50")}>
				<Form {...form}>
					<form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="relative min-w-0 flex-1">
						{isFetching && <div className="absolute inset-0 z-10 bg-transparent" aria-hidden="true" />}
						<div className="flex flex-col gap-1.5 p-3">
							<div className="flex flex-row items-start justify-between">
								<UrlInput urlFetched={urlFetched} fetchMetadata={fetchMetadata} isFetchingUrlMetadata={isFetching} />
								{urlFetched && <TitleInput urlFetched={urlFetched} />}

								<div className="flex flex-row items-center gap-2">
									<FormField
										control={form.control}
										name="learningState"
										render={({ field }) => (
											<FormItem className="space-y-0">
												<FormLabel className="sr-only">Topic</FormLabel>
												<LearningStateSelector
													value={field.value}
													onChange={value => {
														// toggle, if already selected set undefined
														form.setValue("learningState", field.value === value ? undefined : value)
													}}
													showSearch={false}
												/>
											</FormItem>
										)}
									/>
									<TopicSelector onSelect={topic => setSelectedTopic(topic)} />
								</div>
							</div>

							<DescriptionInput />
							<UrlBadge urlFetched={urlFetched} handleResetUrl={handleResetUrl} />
						</div>

						<div
							className="flex flex-row items-center justify-between gap-2 rounded-b-md border-t px-3 py-2"
							onClick={e => {
								if (!(e.target as HTMLElement).closest("button")) {
									const notesInput = e.currentTarget.querySelector("input")
									if (notesInput) {
										notesInput.focus()
									}
								}
							}}
						>
							<NotesSection />

							{isFetching ? (
								<div className="flex w-auto items-center justify-end gap-x-2">
									<span className="text-muted-foreground flex items-center text-sm">
										<svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
												fill="none"
											/>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											/>
										</svg>
										Fetching metadata...
									</span>
								</div>
							) : (
								<div className="flex w-auto items-center justify-end gap-x-2">
									<Button size="sm" type="button" variant="ghost" onClick={handleCancel}>
										Cancel
									</Button>
									<Button size="sm" type="submit" disabled={!canSubmit}>
										Save
									</Button>
								</div>
							)}
						</div>
					</form>
				</Form>
			</div>
		</div>
	)
}

LinkForm.displayName = "LinkForm"
