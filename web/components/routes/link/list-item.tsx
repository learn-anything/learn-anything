"use client"

import { useAtom } from "jotai"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { PersonalLink } from "@/lib/schema/personal-link"
import { cn } from "@/lib/utils"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ConfirmOptions } from "@omit/react-confirm-dialog"
import { LinkIcon, Trash2Icon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import * as React from "react"
import { LinkForm } from "./form/link-form"
import { Command, CommandInput, CommandList, CommandItem, CommandGroup } from "@/components/ui/command"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LaIcon } from "@/components/custom/la-icon"
import { LEARNING_STATES } from "@/lib/constants"
interface ListItemProps {
	confirm: (options: ConfirmOptions) => Promise<boolean>
	personalLink: PersonalLink
	disabled?: boolean
	isEditing: boolean
	setEditId: (id: string | null) => void
	isDragging: boolean
	isFocused: boolean
	setFocusedId: (id: string | null) => void
	registerRef: (id: string, ref: HTMLLIElement | null) => void
	onDelete?: (personalLink: PersonalLink) => void
	showDeleteIconForLinkId: string | null
	setShowDeleteIconForLinkId: (id: string | null) => void
}

export const ListItem: React.FC<ListItemProps> = ({
	confirm,
	isEditing,
	setEditId,
	personalLink,
	disabled = false,
	isDragging,
	isFocused,
	setFocusedId,
	registerRef,
	onDelete,
	showDeleteIconForLinkId,
	setShowDeleteIconForLinkId
}) => {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: personalLink.id, disabled })
	const formRef = React.useRef<HTMLFormElement>(null)

	React.useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (formRef.current && !formRef.current.contains(event.target as Node)) {
				setEditId(null)
			}
		}

		document.addEventListener("mousedown", handleClickOutside)

		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [formRef])

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		pointerEvents: isDragging ? "none" : "auto"
	}

	const refCallback = React.useCallback(
		(node: HTMLLIElement | null) => {
			setNodeRef(node)
			registerRef(personalLink.id, node)
		},
		[setNodeRef, registerRef, personalLink.id]
	)

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault()
			setEditId(personalLink.id)
		}
	}

	const handleSuccess = () => {
		setEditId(null)
	}

	const handleCancel = () => {
		setEditId(null)
	}

	// const handleRowClick = () => {
	// 	setShowDeleteIconForLinkId(personalLink.id)
	// }

	const handleRowDoubleClick = () => {
		setEditId(personalLink.id)
	}

	const handleDelete = async (e: React.MouseEvent, personalLink: PersonalLink) => {
		e.stopPropagation()

		const result = await confirm({
			title: `Delete "${personalLink.title}"?`,
			description: "This action cannot be undone.",
			alertDialogTitle: {
				className: "text-base"
			},
			customActions: (onConfirm, onCancel) => (
				<>
					<Button variant="outline" onClick={onCancel}>
						Cancel
					</Button>
					<Button variant="destructive" onClick={onConfirm}>
						Delete
					</Button>
				</>
			)
		})

		if (result) {
			onDelete?.(personalLink)
		}
	}

	const selectedLearningState = LEARNING_STATES.find(ls => ls.value === personalLink.learningState)

	if (isEditing) {
		return <LinkForm ref={formRef} personalLink={personalLink} onSuccess={handleSuccess} onCancel={handleCancel} />
	}

	return (
		<li
			ref={refCallback}
			style={style as React.CSSProperties}
			{...attributes}
			{...listeners}
			tabIndex={0}
			onFocus={() => setFocusedId(personalLink.id)}
			onBlur={() => {
				setFocusedId(null)
			}}
			onKeyDown={handleKeyDown}
			className={cn("hover:bg-muted/50 relative flex h-14 cursor-default items-center outline-none xl:h-11", {
				"bg-muted/50": isFocused
			})}
			// onClick={handleRowClick}
			onDoubleClick={handleRowDoubleClick}
		>
			<div className="flex grow justify-between gap-x-6 px-6 max-lg:px-4">
				<div className="flex min-w-0 items-center gap-x-4">
					{/* <Checkbox
						checked={personalLink.completed}
						onClick={e => e.stopPropagation()}
						onCheckedChange={() => {
							personalLink.completed = !personalLink.completed
						}}
						className="border-muted-foreground border"
					/> */}
					<Popover>
						<PopoverTrigger asChild>
							<Button size="sm" type="button" role="combobox" variant="secondary" className="size-7 shrink-0 p-0">
								{selectedLearningState?.icon && (
									<LaIcon name={selectedLearningState.icon} className={cn(selectedLearningState.className)} />
								)}
							</Button>
						</PopoverTrigger>
						<PopoverContent
							className="w-52 rounded-lg p-0"
							side="bottom"
							align="start"
							onCloseAutoFocus={e => e.preventDefault()}
						>
							<Command>
								<CommandInput placeholder="Search state..." className="h-9" />
								<CommandList>
									<ScrollArea>
										<CommandGroup>
											{LEARNING_STATES.map(ls => (
												<CommandItem
													key={ls.value}
													value={ls.value}
													onSelect={value => {
														personalLink.learningState = value as "wantToLearn" | "learning" | "learned" | undefined
													}}
												>
													<LaIcon name={ls.icon} className={cn("mr-2", ls.className)} />
													<span className={ls.className}>{ls.label}</span>
													<LaIcon
														name="Check"
														size={16}
														className={cn(
															"absolute right-3",
															ls.value === personalLink.learningState ? "text-primary" : "text-transparent"
														)}
													/>
												</CommandItem>
											))}
										</CommandGroup>
									</ScrollArea>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
					{personalLink.icon && (
						<Image
							src={personalLink.icon}
							alt={personalLink.title}
							className="size-5 rounded-full"
							width={16}
							height={16}
						/>
					)}
					<div className="w-full min-w-0 flex-auto">
						<div className="gap-x-2 space-y-0.5 xl:flex xl:flex-row">
							<p className="text-primary hover:text-primary line-clamp-1 text-sm font-medium xl:truncate">
								{personalLink.title}
							</p>
							{personalLink.url && (
								<div className="group flex items-center gap-x-1">
									<LinkIcon
										aria-hidden="true"
										className="text-muted-foreground group-hover:text-primary size-3 flex-none"
									/>
									<Link
										href={personalLink.url}
										passHref
										prefetch={false}
										target="_blank"
										onClick={e => {
											e.stopPropagation()
										}}
										className="text-muted-foreground hover:text-primary text-xs"
									>
										<span className="xl:truncate">{personalLink.url}</span>
									</Link>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="flex shrink-0 items-center gap-x-4">
					{/* TODO: add back with real topic name */}
					{/* <Badge variant="secondary">Topic Name</Badge> */}
					{showDeleteIconForLinkId === personalLink.id && (
						<Button
							size="icon"
							className="text-destructive h-auto w-auto bg-transparent hover:bg-transparent hover:text-red-500"
							onClick={e => {
								e.stopPropagation()
								handleDelete(e, personalLink)
							}}
						>
							<Trash2Icon size={16} />
						</Button>
					)}
				</div>
			</div>
		</li>
	)
}
