"use client"

import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { LinkIcon, Trash2Icon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { PersonalLink } from "@/lib/schema/personal-link"
import { cn } from "@/lib/utils"
import { LinkForm } from "./form/manage"
import { Button } from "@/components/ui/button"
import { ConfirmOptions } from "@omit/react-confirm-dialog"
import { Badge } from "@/components/ui/badge"

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
	onDelete
}) => {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: personalLink.id, disabled })
	const formRef = React.useRef<HTMLFormElement>(null)

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		pointerEvents: isDragging ? "none" : "auto"
	}

	React.useEffect(() => {
		if (isEditing) {
			formRef.current?.focus()
		}
	}, [isEditing])

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

	const handleRowClick = () => {
		console.log("Row clicked", personalLink.id)
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
			onBlur={() => setFocusedId(null)}
			onKeyDown={handleKeyDown}
			className={cn("hover:bg-muted/50 relative flex h-14 cursor-default items-center outline-none xl:h-11", {
				"bg-muted/50": isFocused
			})}
			onClick={handleRowClick}
		>
			<div className="flex grow justify-between gap-x-6 px-6 max-lg:px-4">
				<div className="flex min-w-0 items-center gap-x-4">
					<Checkbox
						checked={personalLink.completed}
						onClick={e => e.stopPropagation()}
						onCheckedChange={() => {
							personalLink.completed = !personalLink.completed
						}}
						className="border-muted-foreground border"
					/>
					{personalLink.isLink && personalLink.meta && (
						<Image
							src={personalLink.meta.favicon}
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
							{personalLink.isLink && personalLink.meta && (
								<div className="group flex items-center gap-x-1">
									<LinkIcon
										aria-hidden="true"
										className="text-muted-foreground group-hover:text-primary size-3 flex-none"
									/>
									<Link
										href={personalLink.meta.url}
										passHref
										prefetch={false}
										target="_blank"
										onClick={e => {
											e.stopPropagation()
										}}
										className="text-muted-foreground hover:text-primary text-xs"
									>
										<span className="xl:truncate">{personalLink.meta.url}</span>
									</Link>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="flex shrink-0 items-center gap-x-4">
					<Badge variant="secondary">Topic Name</Badge>
					<Button
						size="icon"
						className="text-destructive h-auto w-auto bg-transparent hover:bg-transparent hover:text-red-500"
						onClick={e => handleDelete(e, personalLink)}
					>
						<Trash2Icon size={16} />
					</Button>
				</div>
			</div>
		</li>
	)
}
