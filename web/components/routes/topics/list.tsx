import React, { useCallback, useEffect, useMemo } from "react"
import { Primitive } from "@radix-ui/react-primitive"
import { useAccount } from "@/lib/providers/jazz-provider"
import { atom, useAtom } from "jotai"
import { commandPaletteOpenAtom } from "@/components/custom/command-palette/command-palette"
import { TopicItem } from "./partials/topic-item"
import { useMedia } from "react-use"
import { useRouter } from "next/navigation"
import { useActiveItemScroll } from "@/hooks/use-active-item-scroll"
import { Column } from "@/components/custom/column"
import { useColumnStyles } from "./hooks/use-column-styles"
import { LaAccount, ListOfTopics, Topic, UserRoot } from "@/lib/schema"
import { LearningStateValue } from "@/lib/constants"

interface TopicListProps {
	activeItemIndex: number | null
	setActiveItemIndex: React.Dispatch<React.SetStateAction<number | null>>
	disableEnterKey: boolean
}

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

export const TopicList: React.FC<TopicListProps> = ({ activeItemIndex, setActiveItemIndex, disableEnterKey }) => {
	const { me } = useAccount({ root: { topicsWantToLearn: [], topicsLearning: [], topicsLearned: [] } })

	if (!me) return null

	return (
		<MainTopicList
			me={me}
			activeItemIndex={activeItemIndex}
			setActiveItemIndex={setActiveItemIndex}
			disableEnterKey={disableEnterKey}
		/>
	)
}

export const MainTopicList: React.FC<MainTopicListProps> = ({
	me,
	activeItemIndex,
	setActiveItemIndex,
	disableEnterKey
}) => {
	const isTablet = useMedia("(max-width: 640px)")
	const [isCommandPaletteOpen] = useAtom(commandPaletteOpenAtom)
	const router = useRouter()

	const personalTopics = useMemo(
		() => [
			...me.root.topicsWantToLearn.map(topic => ({ topic, learningState: "wantToLearn" as const })),
			...me.root.topicsLearning.map(topic => ({ topic, learningState: "learning" as const })),
			...me.root.topicsLearned.map(topic => ({ topic, learningState: "learned" as const }))
		],
		[me.root.topicsWantToLearn, me.root.topicsLearning, me.root.topicsLearned]
	)

	const itemCount = personalTopics.length

	const handleEnter = useCallback(
		(selectedTopic: Topic) => {
			router.push(`/${selectedTopic.name}`)
		},
		[router]
	)

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (isCommandPaletteOpen) return

			if (e.key === "ArrowUp" || e.key === "ArrowDown") {
				e.preventDefault()
				setActiveItemIndex(prevIndex => {
					if (prevIndex === null) return 0
					const newIndex = e.key === "ArrowUp" ? (prevIndex - 1 + itemCount) % itemCount : (prevIndex + 1) % itemCount
					return newIndex
				})
			} else if (e.key === "Enter" && !disableEnterKey && activeItemIndex !== null && personalTopics) {
				e.preventDefault()
				const selectedTopic = personalTopics[activeItemIndex]
				if (selectedTopic?.topic) handleEnter?.(selectedTopic.topic)
			}
		},
		[itemCount, isCommandPaletteOpen, activeItemIndex, setActiveItemIndex, disableEnterKey, personalTopics, handleEnter]
	)

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [handleKeyDown])

	return (
		<div className="flex h-full w-full flex-col overflow-hidden border-t">
			{!isTablet && <ColumnHeader />}
			<TopicListItems personalTopics={personalTopics} activeItemIndex={activeItemIndex} />
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

interface TopicListItemsProps {
	personalTopics: PersonalTopic[] | null
	activeItemIndex: number | null
}

const TopicListItems: React.FC<TopicListItemsProps> = ({ personalTopics, activeItemIndex }) => {
	const { setElementRef } = useActiveItemScroll<HTMLDivElement>({ activeIndex: activeItemIndex })

	return (
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
						/>
					)
			)}
		</Primitive.div>
	)
}
