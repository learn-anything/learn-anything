import React, { useCallback, useMemo } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useColumnStyles } from "../hooks/use-column-styles"
import { Topic } from "@/lib/schema"
import { Column } from "@/components/custom/column"
import { Button } from "@/components/ui/button"
import { LaIcon } from "@/components/custom/la-icon"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { LearningStateSelectorContent } from "@/components/custom/learning-state-selector"
import { useAtom } from "jotai"
import { topicOpenPopoverForIdAtom } from "../list"
import { LEARNING_STATES, LearningStateValue } from "@/lib/constants"

interface TopicItemProps {
	topic: Topic
	learningState: LearningStateValue
	isActive: boolean
}

export const TopicItem = React.forwardRef<HTMLDivElement, TopicItemProps>(({ topic, learningState, isActive }, ref) => {
	const columnStyles = useColumnStyles()
	const [openPopoverForId, setOpenPopoverForId] = useAtom(topicOpenPopoverForIdAtom)

	const selectedLearningState = useMemo(() => LEARNING_STATES.find(ls => ls.value === learningState), [learningState])
	const handleLearningStateSelect = useCallback(
		(value: string) => {
			const learningState = value as LearningStateValue

			setOpenPopoverForId(null)
		},
		[setOpenPopoverForId]
	)

	const handlePopoverTriggerClick = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()

		setOpenPopoverForId(openPopoverForId === topic.id ? null : topic.id)
	}

	return (
		<div
			ref={ref}
			className={cn("relative block", "min-h-12 py-2 max-lg:px-5 sm:px-6", {
				"bg-muted-foreground/5": isActive,
				"hover:bg-muted/50": !isActive
			})}
			role="listitem"
		>
			<Link
				href={`/${topic.name}`}
				className="flex h-full cursor-default items-center gap-4 outline-none"
				tabIndex={isActive ? 0 : -1}
			>
				<Column.Wrapper style={columnStyles.title}>
					<Column.Text className="truncate text-[13px] font-medium">{topic.prettyName}</Column.Text>
				</Column.Wrapper>

				<Column.Wrapper style={columnStyles.topic} className="max-sm:justify-end">
					<Popover
						open={openPopoverForId === topic.id}
						onOpenChange={(open: boolean) => setOpenPopoverForId(open ? topic.id : null)}
					>
						<PopoverTrigger asChild>
							<Button
								size="sm"
								type="button"
								role="combobox"
								variant="secondary"
								className="size-7 shrink-0 p-0"
								onClick={handlePopoverTriggerClick}
							>
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
							align="end"
							onCloseAutoFocus={e => e.preventDefault()}
						>
							<LearningStateSelectorContent
								showSearch={false}
								searchPlaceholder="Search state..."
								value={learningState}
								onSelect={handleLearningStateSelect}
							/>
						</PopoverContent>
					</Popover>
				</Column.Wrapper>
			</Link>
		</div>
	)
})

TopicItem.displayName = "TopicItem"
