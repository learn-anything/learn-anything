import React, { useCallback, useMemo } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useColumnStyles } from "../hooks/use-column-styles"
import { ListOfTopics, Topic } from "@/lib/schema"
import { Column } from "@/components/custom/column"
import { Button } from "@/components/ui/button"
import { LaIcon } from "@/components/custom/la-icon"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { LearningStateSelectorContent } from "@/components/custom/learning-state-selector"
import { useAtom } from "jotai"
import { topicOpenPopoverForIdAtom } from "../list"
import { LEARNING_STATES, LearningStateValue } from "@/lib/constants"
import { useAccount } from "@/lib/providers/jazz-provider"
import { useRouter } from "next/navigation"

interface TopicItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
	topic: Topic
	learningState: LearningStateValue
	isActive: boolean
}

export const TopicItem = React.forwardRef<HTMLAnchorElement, TopicItemProps>(
	({ topic, learningState, isActive, ...props }, ref) => {
		const columnStyles = useColumnStyles()
		const [openPopoverForId, setOpenPopoverForId] = useAtom(topicOpenPopoverForIdAtom)
		const router = useRouter()
		const { me } = useAccount({ root: { topicsWantToLearn: [], topicsLearning: [], topicsLearned: [] } })

		let p: {
			index: number
			topic?: Topic | null
			learningState: LearningStateValue
		} | null = null

		const wantToLearnIndex = me?.root.topicsWantToLearn.findIndex(t => t?.id === topic.id) ?? -1
		if (wantToLearnIndex !== -1) {
			p = {
				index: wantToLearnIndex,
				topic: me?.root.topicsWantToLearn[wantToLearnIndex],
				learningState: "wantToLearn"
			}
		}

		const learningIndex = me?.root.topicsLearning.findIndex(t => t?.id === topic.id) ?? -1
		if (learningIndex !== -1) {
			p = {
				index: learningIndex,
				topic: me?.root.topicsLearning[learningIndex],
				learningState: "learning"
			}
		}

		const learnedIndex = me?.root.topicsLearned.findIndex(t => t?.id === topic.id) ?? -1
		if (learnedIndex !== -1) {
			p = {
				index: learnedIndex,
				topic: me?.root.topicsLearned[learnedIndex],
				learningState: "learned"
			}
		}

		const selectedLearningState = useMemo(() => LEARNING_STATES.find(ls => ls.value === learningState), [learningState])

		const handleLearningStateSelect = useCallback(
			(value: string) => {
				const newLearningState = value as LearningStateValue

				const topicLists: Record<LearningStateValue, (ListOfTopics | null) | undefined> = {
					wantToLearn: me?.root.topicsWantToLearn,
					learning: me?.root.topicsLearning,
					learned: me?.root.topicsLearned
				}

				const removeFromList = (state: LearningStateValue, index: number) => {
					topicLists[state]?.splice(index, 1)
				}

				if (p) {
					if (newLearningState === p.learningState) {
						removeFromList(p.learningState, p.index)
						return
					}
					removeFromList(p.learningState, p.index)
				}

				topicLists[newLearningState]?.push(topic)

				setOpenPopoverForId(null)
			},
			[setOpenPopoverForId, me?.root.topicsWantToLearn, me?.root.topicsLearning, me?.root.topicsLearned, p, topic]
		)

		const handlePopoverTriggerClick = (e: React.MouseEvent) => {
			e.preventDefault()
			e.stopPropagation()

			setOpenPopoverForId(openPopoverForId === topic.id ? null : topic.id)
		}

		const handleKeyDown = React.useCallback(
			(ev: React.KeyboardEvent<HTMLAnchorElement>) => {
				if (ev.key === "Enter") {
					ev.preventDefault()
					ev.stopPropagation()
					router.push(`/${topic.name}`)
				}
			},
			[router, topic.name]
		)

		return (
			<Link
				ref={ref}
				href={`/${topic.name}`}
				tabIndex={isActive ? 0 : -1}
				className={cn(
					"relative block cursor-default outline-none",
					"min-h-12 py-2 max-lg:px-4 sm:px-6",
					"data-[active='true']:bg-[var(--link-background-muted)] data-[keyboard-active='true']:focus-visible:shadow-[var(--link-shadow)_0px_0px_0px_1px_inset]"
				)}
				aria-selected={isActive}
				data-active={isActive}
				onKeyDown={handleKeyDown}
				{...props}
			>
				<div className="flex h-full cursor-default items-center gap-4 outline-none" tabIndex={isActive ? 0 : -1}>
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
								onClick={e => e.stopPropagation()}
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
				</div>
			</Link>
		)
	}
)

TopicItem.displayName = "TopicItem"
