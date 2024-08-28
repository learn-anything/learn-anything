"use client"

import React, { useCallback, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { useAtom } from "jotai"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LaIcon } from "@/components/custom/la-icon"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { LearningStateSelectorContent } from "@/components/custom/learning-state-selector"
import { PersonalLink } from "@/lib/schema/personal-link"
import { LinkForm } from "./form/link-form"
import { cn } from "@/lib/utils"
import { LEARNING_STATES, LearningStateValue } from "@/lib/constants"
import { linkOpenPopoverForIdAtom, linkShowCreateAtom } from "@/store/link"

interface LinkItemProps {
	personalLink: PersonalLink
	disabled?: boolean
	isEditing: boolean
	setEditId: (id: string | null) => void
	isDragging: boolean
	isFocused: boolean
	setFocusedId: (id: string | null) => void
	registerRef: (id: string, ref: HTMLLIElement | null) => void
}

export const LinkItem: React.FC<LinkItemProps> = ({
	isEditing,
	setEditId,
	personalLink,
	disabled = false,
	isDragging,
	isFocused,
	setFocusedId,
	registerRef
}) => {
	const [openPopoverForId, setOpenPopoverForId] = useAtom(linkOpenPopoverForIdAtom)
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: personalLink.id, disabled })

	const style = useMemo(
		() => ({
			transform: CSS.Transform.toString(transform),
			transition,
			pointerEvents: isDragging ? "none" : "auto"
		}),
		[transform, transition, isDragging]
	)

	const refCallback = useCallback(
		(node: HTMLLIElement | null) => {
			setNodeRef(node)
			registerRef(personalLink.id, node)
		},
		[setNodeRef, registerRef, personalLink.id]
	)

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter") {
				e.preventDefault()
				setEditId(personalLink.id)
			}
		},
		[setEditId, personalLink.id]
	)

	const handleSuccess = useCallback(() => setEditId(null), [setEditId])
	const handleOnClose = useCallback(() => setEditId(null), [setEditId])
	const handleRowDoubleClick = useCallback(() => setEditId(personalLink.id), [setEditId, personalLink.id])

	const selectedLearningState = useMemo(
		() => LEARNING_STATES.find(ls => ls.value === personalLink.learningState),
		[personalLink.learningState]
	)

	const handleLearningStateSelect = useCallback(
		(value: string) => {
			const learningState = value as LearningStateValue
			personalLink.learningState = personalLink.learningState === learningState ? undefined : learningState
			setOpenPopoverForId(null)
		},
		[personalLink, setOpenPopoverForId]
	)

	if (isEditing) {
		return <LinkForm onClose={handleOnClose} personalLink={personalLink} onSuccess={handleSuccess} onFail={() => {}} />
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
			className={cn("relative flex h-14 cursor-default items-center outline-none xl:h-11", {
				"bg-muted-foreground/10": isFocused,
				"hover:bg-muted/50": !isFocused
			})}
			onDoubleClick={handleRowDoubleClick}
		>
			<div className="flex grow justify-between gap-x-6 px-6 max-lg:px-4">
				<div className="flex min-w-0 items-center gap-x-4">
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
								searchPlaceholder="Search state..."
								value={personalLink.learningState}
								onSelect={handleLearningStateSelect}
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
									<LaIcon
										name="Link"
										aria-hidden="true"
										className="text-muted-foreground group-hover:text-primary size-3 flex-none"
									/>
									<Link
										href={personalLink.url}
										passHref
										prefetch={false}
										target="_blank"
										onClick={e => e.stopPropagation()}
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
				</div>
			</div>
		</li>
	)
}
