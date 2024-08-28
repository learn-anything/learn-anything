"use client"

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
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

import { LaIcon } from "@/components/custom/la-icon"
import { LEARNING_STATES, LearningStateValue } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { LearningStateSelectorContent } from "@/components/custom/learning-state-selector"

interface ListItemProps {
	openPopoverForId: string | number | null
	setOpenPopoverForId: (id: string | null) => void
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
	openPopoverForId,
	setOpenPopoverForId,
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

	const handleOnClose = () => {
		setEditId(null)
	}

	const handleOnFail = () => {}

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
		return (
			<LinkForm onClose={handleOnClose} personalLink={personalLink} onSuccess={handleSuccess} onFail={handleOnFail} />
		)
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
			className={cn("relative flex h-14 cursor-default items-center outline-none xl:h-11", {
				"bg-muted-foreground/10": isFocused,
				"hover:bg-muted/50": !isFocused
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

					<Popover
						open={openPopoverForId === personalLink.id}
						onOpenChange={(open: boolean) => setOpenPopoverForId(open ? personalLink.id : null)}
					>
						<PopoverTrigger asChild>
							<Button size="sm" type="button" role="combobox" variant="secondary" className="size-7 shrink-0 p-0">
								{selectedLearningState?.icon ? (
									<LaIcon name={selectedLearningState.icon} className={cn(selectedLearningState.className)} />
								) : (
									<LaIcon name="Circle" />
								)}
							</Button>
						</PopoverTrigger>
						<PopoverContent
							className="w-52 rounded-lg p-0"
							side="bottom"
							align="start"
							onCloseAutoFocus={e => e.preventDefault()}
						>
							<LearningStateSelectorContent
								showSearch={false}
								searchPlaceholder={"Search state..."}
								value={personalLink.learningState}
								onSelect={value => {
									// toggle, if already selected set undefined
									const learningState = value as LearningStateValue
									personalLink.learningState = personalLink.learningState === learningState ? undefined : learningState

									setOpenPopoverForId(null)
								}}
							/>
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
					{personalLink.topic && <Badge variant="secondary">{personalLink.topic.prettyName}</Badge>}
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
