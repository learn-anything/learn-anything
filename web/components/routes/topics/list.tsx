import * as React from "react"
import { Primitive } from "@radix-ui/react-primitive"
import { useAccount } from "@/lib/providers/jazz-provider"
import { atom } from "jotai"
import { TopicItem } from "./partials/topic-item"
import { useMedia } from "@/hooks/use-media"
import { useRouter } from "next/navigation"
import { useActiveItemScroll } from "@/hooks/use-active-item-scroll"
import { Column } from "@/components/custom/column"
import { useColumnStyles } from "./hooks/use-column-styles"
import { LaAccount, ListOfTopics, Topic, UserRoot } from "@/lib/schema"
import { LearningStateValue } from "@/lib/constants"
import { useKeyDown } from "@/hooks/use-key-down"

interface TopicListProps {}

interface MainTopicListProps extends TopicListProps {
	me: {
		root: {
			topicsWantToLearn: ListOfTopics
			topicsLearning: ListOfTopics
			topicsLearned: ListOfTopics
		} & UserRoot
	} & LaAccount
}

export interface PersonalTopic {
	topic: Topic | null
	learningState: LearningStateValue
}

export const topicOpenPopoverForIdAtom = atom<string | null>(null)

export const TopicList: React.FC<TopicListProps> = () => {
	const { me } = useAccount({ root: { topicsWantToLearn: [], topicsLearning: [], topicsLearned: [] } })

	if (!me) return null

	return <MainTopicList me={me} />
}

export const MainTopicList: React.FC<MainTopicListProps> = ({ me }) => {
	const isTablet = useMedia("(max-width: 640px)")
	const [activeItemIndex, setActiveItemIndex] = React.useState<number | null>(null)
	const [keyboardActiveIndex, setKeyboardActiveIndex] = React.useState<number | null>(null)

	const personalTopics = React.useMemo(
		() => [
			...me.root.topicsWantToLearn.map(topic => ({ topic, learningState: "wantToLearn" as const })),
			...me.root.topicsLearning.map(topic => ({ topic, learningState: "learning" as const })),
			...me.root.topicsLearned.map(topic => ({ topic, learningState: "learned" as const }))
		],
		[me.root.topicsWantToLearn, me.root.topicsLearning, me.root.topicsLearned]
	)

	const next = () => Math.min((activeItemIndex ?? 0) + 1, (personalTopics?.length ?? 0) - 1)

	const prev = () => Math.max((activeItemIndex ?? 0) - 1, 0)

	const handleKeyDown = (ev: KeyboardEvent) => {
		switch (ev.key) {
			case "ArrowDown":
				ev.preventDefault()
				ev.stopPropagation()
				setActiveItemIndex(next())
				setKeyboardActiveIndex(next())
				break
			case "ArrowUp":
				ev.preventDefault()
				ev.stopPropagation()
				setActiveItemIndex(prev())
				setKeyboardActiveIndex(prev())
		}
	}

	useKeyDown(() => true, handleKeyDown)

	const { setElementRef } = useActiveItemScroll<HTMLAnchorElement>({ activeIndex: keyboardActiveIndex })

	return (
		<div className="flex h-full w-full flex-col overflow-hidden border-t">
			{!isTablet && <ColumnHeader />}
			<Primitive.div
				className="divide-primary/5 flex flex-1 flex-col divide-y overflow-y-auto outline-none [scrollbar-gutter:stable]"
				tabIndex={-1}
				role="list"
			>
				{personalTopics?.map(
					(pt, index) =>
						pt.topic?.id && (
							<TopicItem
								key={pt.topic.id}
								ref={el => setElementRef(el, index)}
								topic={pt.topic}
								learningState={pt.learningState}
								isActive={index === activeItemIndex}
								onPointerMove={() => {
									setKeyboardActiveIndex(null)
									setActiveItemIndex(index)
								}}
								data-keyboard-active={keyboardActiveIndex === index}
							/>
						)
				)}
			</Primitive.div>
		</div>
	)
}

export const ColumnHeader: React.FC = () => {
	const columnStyles = useColumnStyles()

	return (
		<div className="flex h-8 shrink-0 grow-0 flex-row gap-4 border-b max-lg:px-4 sm:px-6">
			<Column.Wrapper style={columnStyles.title}>
				<Column.Text>Name</Column.Text>
			</Column.Wrapper>
			<Column.Wrapper style={columnStyles.topic}>
				<Column.Text>State</Column.Text>
			</Column.Wrapper>
		</div>
	)
}
