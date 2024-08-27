"use client"

import * as React from "react"
import { ContentHeader, SidebarToggleButton } from "@/components/custom/content-header"
import { ListOfTopics, Topic } from "@/lib/schema"
import { LearningStateSelector } from "@/components/custom/learning-state-selector"
import { useAccount } from "@/lib/providers/jazz-provider"
import { LearningStateValue } from "@/lib/constants"

interface TopicDetailHeaderProps {
	topic: Topic
}

export const TopicDetailHeader = React.memo(function TopicDetailHeader({ topic }: TopicDetailHeaderProps) {
	const { me } = useAccount({
		root: {
			topicsWantToLearn: [],
			topicsLearning: [],
			topicsLearned: []
		}
	})

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

	const handleAddToProfile = (learningState: LearningStateValue) => {
		const topicLists: Record<LearningStateValue, (ListOfTopics | null) | undefined> = {
			wantToLearn: me?.root.topicsWantToLearn,
			learning: me?.root.topicsLearning,
			learned: me?.root.topicsLearned
		}

		const removeFromList = (state: LearningStateValue, index: number) => {
			topicLists[state]?.splice(index, 1)
		}

		if (p) {
			if (learningState === p.learningState) {
				removeFromList(p.learningState, p.index)
				return
			}
			removeFromList(p.learningState, p.index)
		}

		topicLists[learningState]?.push(topic)
	}

	return (
		<ContentHeader className="px-6 py-5 max-lg:px-4">
			<div className="flex min-w-0 shrink-0 items-center gap-1.5">
				<SidebarToggleButton />
				<div className="flex min-h-0 items-center">
					<span className="truncate text-left text-xl font-bold">{topic.prettyName}</span>
				</div>
			</div>

			<div className="flex flex-auto"></div>

			<LearningStateSelector
				value={p?.learningState || ""}
				onChange={handleAddToProfile}
				defaultLabel="Add to my profile"
			/>
		</ContentHeader>
	)
})

TopicDetailHeader.displayName = "TopicDetailHeader"
