import * as React from "react"
import { useAccount, useCoState } from "@/lib/providers/jazz-provider"
import { LinkMetadata, PersonalLink } from "@/lib/schema"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { createLinkSchema } from "./schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDebounce } from "react-use"
import { cn, ensureUrlProtocol, generateUniqueSlug, isUrl } from "@/lib/utils"
import { toast } from "sonner"
import { Form, FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LearningStateSelector } from "./partial/learning-state-selector"
import { TopicSelector } from "./partial/topic-selector"
import { TextareaAutosize } from "@/components/custom/textarea-autosize"
import { Button } from "@/components/ui/button"
import { z } from "zod"

interface LinkFormProps extends React.ComponentPropsWithoutRef<"form"> {
	onSuccess?: () => void
	onCancel?: () => void
	personalLink?: PersonalLink
}

export type LinkFormValues = z.infer<typeof createLinkSchema>

const defaultValues: Partial<LinkFormValues> = {
	title: "",
	description: "",
	learningState: "wantToLearn",
	topic: "",
	isLink: false,
	meta: null
}

export const LinkForm = React.forwardRef<HTMLFormElement, LinkFormProps>(
	({ onSuccess, onCancel, personalLink }, ref) => {
		const [isFetching, setIsFetching] = useState(false)
		const { me } = useAccount()
		const form = useForm<LinkFormValues>({
			resolver: zodResolver(createLinkSchema),
			defaultValues
		})

		const selectedLink = useCoState(PersonalLink, personalLink?.id)
		const title = form.watch("title")
		const [inputValue, setInputValue] = useState("")
		const [originalLink, setOriginalLink] = useState<string>("")
		const [linkValidation, setLinkValidation] = useState<string | null>(null)
		const [invalidLink, setInvalidLink] = useState(false)
		const [showLink, setShowLink] = useState(false)
		const [debouncedText, setDebouncedText] = useState<string>("")

		useDebounce(() => setDebouncedText(title), 300, [title])

		React.useEffect(() => {
			if (selectedLink) {
				form.setValue("title", selectedLink.title)
				form.setValue("description", selectedLink.description ?? "")
				form.setValue("isLink", selectedLink.isLink)
				form.setValue("meta", selectedLink.meta)
			}
		}, [selectedLink, form])

		const changeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value
			setInputValue(value)
			form.setValue("title", value)
		}

		const pressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter" && !showLink) {
				e.preventDefault()
				const trimmedValue = inputValue.trim().toLowerCase()
				if (isUrl(trimmedValue)) {
					setShowLink(true)
					setInvalidLink(false)
					setLinkValidation(trimmedValue)
					setInputValue(trimmedValue)
					form.setValue("title", trimmedValue)
				} else {
					setInvalidLink(true)
					setShowLink(true)
					setLinkValidation(null)
				}
			}
		}

		React.useEffect(() => {
			const fetchMetadata = async (url: string) => {
				setIsFetching(true)
				try {
					const res = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`, { cache: "force-cache" })
					if (!res.ok) throw new Error("Failed to fetch metadata")
					const data = await res.json()
					form.setValue("isLink", true)
					form.setValue("meta", data)
					form.setValue("title", data.title)
					form.setValue("description", data.description)
					setOriginalLink(url)
				} catch (err) {
					form.setValue("isLink", false)
					form.setValue("meta", null)
					form.setValue("title", debouncedText)
					form.setValue("description", "")
					setOriginalLink("")
				} finally {
					setIsFetching(false)
				}
			}
			if (showLink && !invalidLink && isUrl(form.getValues("title").toLowerCase())) {
				fetchMetadata(ensureUrlProtocol(form.getValues("title").toLowerCase()))
			}
		}, [showLink, invalidLink, form])

		const onSubmit = (values: LinkFormValues) => {
			if (isFetching) return

			try {
				let linkMetadata: LinkMetadata | undefined

				const personalLinks = me.root?.personalLinks?.toJSON() || []
				const slug = generateUniqueSlug(personalLinks, values.title)

				if (values.isLink && values.meta) {
					linkMetadata = LinkMetadata.create(values.meta, { owner: me._owner })
				}

				if (selectedLink) {
					selectedLink.title = values.title
					selectedLink.slug = slug
					selectedLink.description = values.description ?? ""
					selectedLink.isLink = values.isLink

					if (values.isLink && values.meta) {
						linkMetadata = LinkMetadata.create(values.meta, { owner: me._owner })
					}
				} else {
					const newPersonalLink = PersonalLink.create(
						{
							title: values.title,
							slug,
							description: values.description,
							sequence: me.root?.personalLinks?.length || 1,
							completed: false,
							isLink: values.isLink,
							meta: linkMetadata
							// topic: values.topic
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

		const undoEditing: () => void = () => {
			form.reset(defaultValues)
			onCancel?.()
		}

		return (
			<div className="p-3 transition-all">
				<div className="bg-muted/50 rounded-md border">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="relative min-w-0 flex-1" ref={ref}>
							<div className="flex flex-row p-3">
								<div className="flex flex-auto flex-col gap-1.5">
									<div className="flex flex-row items-start justify-between">
										<div className="flex grow flex-row items-center gap-1.5">
											<FormField
												control={form.control}
												name="title"
												render={({ field }) => (
													<FormItem className="grow space-y-0">
														<FormLabel className="sr-only">Text</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={inputValue}
																autoComplete="off"
																maxLength={100}
																autoFocus
																placeholder="Paste a link or write a link"
																className={cn(
																	"placeholder:text-primary/40 h-6 border-none p-1.5 font-medium focus-visible:ring-0",
																	invalidLink ? "text-red-500" : ""
																)}
																onKeyDown={pressEnter}
																onChange={changeInput}
															/>
														</FormControl>
													</FormItem>
												)}
											/>
											{showLink && (
												<span className={cn("mr-5 max-w-[200px] truncate text-xs", invalidLink ? "text-red-500" : "")}>
													{invalidLink ? "Only links are allowed" : linkValidation || originalLink || ""}
												</span>
											)}
										</div>

										<div className="flex flex-row items-center gap-2">
											<LearningStateSelector />
										</div>
									</div>

									<div className="flex flex-row items-center gap-1.5 pl-8">
										<FormField
											control={form.control}
											name="description"
											render={({ field }) => (
												<FormItem className="grow space-y-0">
													<FormLabel className="sr-only">Description</FormLabel>
													<FormControl>
														<TextareaAutosize
															{...field}
															autoComplete="off"
															placeholder="Description (optional)"
															className="placeholder:text-primary/40 min-h-6 resize-none overflow-y-auto border-none p-1.5 text-xs font-medium shadow-none focus-visible:ring-0"
														/>
													</FormControl>
												</FormItem>
											)}
										/>
									</div>
								</div>
							</div>

							<div className="flex flex-auto flex-row items-center justify-between gap-2 rounded-b-md border border-t px-3 py-2">
								<div className="flex flex-row items-center gap-0.5">
									<div className="flex min-w-0 shrink-0 cursor-pointer select-none flex-row">
										<TopicSelector />
									</div>
								</div>
								<div className="flex w-auto items-center justify-end">
									<div className="flex min-w-0 shrink-0 cursor-pointer select-none flex-row gap-x-2">
										<Button size="sm" type="button" variant="ghost" onClick={undoEditing}>
											Cancel
										</Button>
										<Button size="sm" type="submit" disabled={isFetching}>
											Save
										</Button>
									</div>
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
