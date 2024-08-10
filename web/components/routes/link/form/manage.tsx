"use client"

import React, { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDebounce } from "react-use"
import { toast } from "sonner"
import Image from "next/image"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { BoxIcon, PlusIcon, Trash2Icon, PieChartIcon, Bookmark, GraduationCap, Check } from "lucide-react"
import { cn, ensureUrlProtocol, generateUniqueSlug, isUrl as LibIsUrl } from "@/lib/utils"
import { useAccount, useCoState } from "@/lib/providers/jazz-provider"
import { LinkMetadata, PersonalLink } from "@/lib/schema/personal-link"
import { createLinkSchema } from "./schema"
import { TopicSelector } from "./partial/topic-section"
import { useAtom } from "jotai"
import { linkEditIdAtom, linkShowCreateAtom } from "@/store/link"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useKey } from "react-use"

export type LinkFormValues = z.infer<typeof createLinkSchema>

const DEFAULT_FORM_VALUES: Partial<LinkFormValues> = {
	title: "",
	description: "",
	topic: "",
	isLink: false,
	meta: null
}

const LinkManage: React.FC = () => {
	const [showCreate, setShowCreate] = useAtom(linkShowCreateAtom)
	const [, setEditId] = useAtom(linkEditIdAtom)
	const formRef = useRef<HTMLFormElement>(null)
	const buttonRef = useRef<HTMLButtonElement>(null)

	const toggleForm = (event: React.MouseEvent) => {
		event.stopPropagation()
		setShowCreate(prev => !prev)
	}

	useEffect(() => {
		if (!showCreate) {
			formRef.current?.reset()
			setEditId(null)
		}
	}, [showCreate, setEditId])

	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			if (
				formRef.current &&
				!formRef.current.contains(event.target as Node) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target as Node)
			) {
				setShowCreate(false)
			}
		}

		if (showCreate) {
			document.addEventListener("mousedown", handleOutsideClick)
		}

		return () => {
			document.removeEventListener("mousedown", handleOutsideClick)
		}
	}, [showCreate, setShowCreate])

	useKey("Escape", () => {
		setShowCreate(false)
	})

	return (
		<>
			{showCreate && (
				<div className="z-50">
					<LinkForm ref={formRef} onSuccess={() => setShowCreate(false)} onCancel={() => setShowCreate(false)} />
				</div>
			)}
			<CreateButton ref={buttonRef} onClick={toggleForm} isOpen={showCreate} />
		</>
	)
}

const CreateButton = React.forwardRef<
	HTMLButtonElement,
	{
		onClick: (event: React.MouseEvent) => void
		isOpen: boolean
	}
>(({ onClick, isOpen }, ref) => (
	<Button
		ref={ref}
		className={cn(
			"absolute bottom-4 right-4 size-12 rounded-full bg-[#274079] p-0 text-white transition-transform hover:bg-[#274079]/90",
			{ "rotate-45 transform": isOpen }
		)}
		onClick={onClick}
	>
		<PlusIcon className="size-6" />
	</Button>
))

CreateButton.displayName = "CreateButton"

interface LinkFormProps extends React.ComponentPropsWithoutRef<"form"> {
	onSuccess?: () => void
	onCancel?: () => void
	personalLink?: PersonalLink
}

const LinkForm = React.forwardRef<HTMLFormElement, LinkFormProps>(({ onSuccess, onCancel, personalLink }, ref) => {
	const [isFetching, setIsFetching] = useState(false)
	const { me } = useAccount()
	const form = useForm<LinkFormValues>({
		resolver: zodResolver(createLinkSchema),
		defaultValues: {
			...DEFAULT_FORM_VALUES,
			isLink: true
		}
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
	const [showStatusOptions, setShowStatusOptions] = useState(false)
	const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

	const statusOptions = [
		{
			text: "To Learn",
			icon: <Bookmark size={16} />,
			color: "text-white/70"
		},
		{
			text: "Learning",
			icon: <GraduationCap size={16} />,
			color: "text-[#D29752]"
		},
		{ text: "Learned", icon: <Check size={16} />, color: "text-[#708F51]" }
	]

	const statusSelect = (status: string) => {
		setSelectedStatus(status === selectedStatus ? null : status)
		setShowStatusOptions(false)
	}

	useEffect(() => {
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
			if (LibIsUrl(trimmedValue)) {
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

	useEffect(() => {
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
		if (showLink && !invalidLink && LibIsUrl(form.getValues("title").toLowerCase())) {
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

			form.reset(DEFAULT_FORM_VALUES)
			onSuccess?.()
		} catch (error) {
			console.error("Failed to create/update link", error)
			toast.error(personalLink ? "Failed to update link" : "Failed to create link")
		}
	}

	const undoEditing: () => void = () => {
		form.reset(DEFAULT_FORM_VALUES)
		onCancel?.()
	}

	return (
		<div className="p-3 transition-all">
			<div className="rounded-md border bg-muted/50">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="relative min-w-0 flex-1" ref={ref}>
						<div className="flex flex-row p-3">
							<div className="flex flex-auto flex-col gap-1.5">
								<div className="flex flex-row items-start justify-between">
									<div className="flex grow flex-row items-center gap-1.5">
										{/* <Button
											type="button"
											variant="secondary"
											size="icon"
											aria-label="Choose icon"
											className="size-7 text-primary/60"
										>
											{form.watch("isLink") ? (
												<Image
													src={form.watch("meta")?.favicon || ""}
													alt={form.watch("meta")?.title || ""}
													className="size-5 rounded-md"
													width={16}
													height={16}
												/>
											) : (
												<BoxIcon size={16} />
											)}
										</Button> */}

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
																"h-6 border-none p-1.5 font-medium placeholder:text-primary/40 focus-visible:outline-none focus-visible:ring-0",
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

									<div className="flex min-w-0 shrink-0 cursor-pointer select-none flex-row">
										<DropdownMenu>
											<DropdownMenuTrigger asChild></DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>Actions</DropdownMenuLabel>
												<DropdownMenuItem className="group">
													<Trash2Icon size={16} className="mr-2 text-destructive group-hover:text-red-500" />
													<span>Delete</span>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
										<div className="relative">
											<Button
												size="icon"
												type="button"
												variant="ghost"
												className="size-7 gap-x-2 text-sm"
												onClick={() => setShowStatusOptions(!showStatusOptions)}
											>
												{selectedStatus ? (
													(() => {
														const option = statusOptions.find(opt => opt.text === selectedStatus)
														return option
															? React.cloneElement(option.icon, {
																	size: 16,
																	className: option.color
																})
															: null
													})()
												) : (
													<PieChartIcon size={16} className="text-primary/60" />
												)}
											</Button>
											{showStatusOptions && (
												<div className="absolute right-0 mt-1 w-40 rounded-md bg-neutral-800 shadow-lg">
													{statusOptions.map(option => (
														<Button
															key={option.text}
															onClick={() => statusSelect(option.text)}
															className={`flex w-full items-center justify-start space-x-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-neutral-700 ${option.color} bg-inherit`}
														>
															{React.cloneElement(option.icon, {
																size: 16,
																className: option.color
															})}
															<span>{option.text}</span>
														</Button>
													))}
												</div>
											)}
										</div>
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
													<Textarea
														{...field}
														autoComplete="off"
														placeholder="Description (optional)"
														className="min-h-[24px] resize-none overflow-y-auto border-none p-1.5 text-xs font-medium shadow-none placeholder:text-primary/40 focus-visible:outline-none focus-visible:ring-0"
														onInput={e => {
															const target = e.target as HTMLTextAreaElement
															target.style.height = "auto"
															target.style.height = `${target.scrollHeight}px`
														}}
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
})

LinkManage.displayName = "LinkManage"
LinkForm.displayName = "LinkForm"

export { LinkManage, LinkForm }
