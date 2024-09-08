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
import { linkOpenPopoverForIdAtom } from "@/store/link"

interface LinkItemProps {
	personalLink: PersonalLink
	disabled?: boolean
	isEditing: boolean
	setEditId: (id: string | null) => void
	isDragging: boolean
	isActive: boolean
	setActiveItemIndex: (index: number | null) => void
	index: number
}

export const LinkItem: React.FC<LinkItemProps> = ({
	isEditing,
	setEditId,
	personalLink,
	disabled = false,
	isDragging,
	isActive,
	setActiveItemIndex,
	index
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
			ref={setNodeRef}
			style={style as React.CSSProperties}
			{...attributes}
			{...listeners}
			tabIndex={0}
			onFocus={() => setActiveItemIndex(index)}
			onBlur={() => setActiveItemIndex(null)}
			onKeyDown={handleKeyDown}
			className={cn(
				"relative cursor-default outline-none",
				"grid grid-cols-[auto_1fr_auto] items-center gap-x-2 px-2 py-2 sm:px-4 sm:py-2",
				{
					"bg-muted-foreground/10": isActive,
					"hover:bg-muted/50": !isActive
				}
			)}
			onDoubleClick={handleRowDoubleClick}
		>
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

			<div className="flex min-w-0 flex-col items-start gap-y-1 overflow-hidden md:flex-row md:items-center md:gap-x-2">
				{personalLink.icon && (
					<Image
						src={personalLink.icon}
						alt={personalLink.title}
						className="size-5 shrink-0 rounded-full"
						width={16}
						height={16}
					/>
				)}
				<div className="flex min-w-0 flex-col items-start gap-y-1 overflow-hidden md:flex-row md:items-center md:gap-x-2">
					<p className="text-primary hover:text-primary truncate text-sm font-medium">{personalLink.title}</p>
					{personalLink.url && (
						<div className="text-muted-foreground flex min-w-0 shrink items-center gap-x-1">
							<LaIcon name="Link" aria-hidden="true" className="size-3 flex-none" />
							<Link
								href={personalLink.url}
								passHref
								prefetch={false}
								target="_blank"
								onClick={e => e.stopPropagation()}
								className="hover:text-primary truncate text-xs"
							>
								{personalLink.url}
							</Link>
						</div>
					)}
				</div>
			</div>

			<div className="flex shrink-0 items-center justify-end">
				{personalLink.topic && <Badge variant="secondary">{personalLink.topic.prettyName}</Badge>}
			</div>
		</li>
	)
}
