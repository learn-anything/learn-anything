"use client"

import * as React from "react"
import { ContentHeader, SidebarToggleButton } from "@/components/custom/content-header"
import { ListOfTopics, Topic } from "@/lib/schema"
import { LearningStateSelector } from "@/components/custom/learning-state-selector"
import { useAccountOrGuest } from "@/lib/providers/jazz-provider"
import { LearningStateValue } from "@/lib/constants"
import { useClerk } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import { useMedia } from "@/hooks/use-media"

interface TopicDetailHeaderProps {
	topic: Topic
}

export const TopicDetailHeader = React.memo(function TopicDetailHeader({ topic }: TopicDetailHeaderProps) {
	const clerk = useClerk()
	const pathname = usePathname()
	const isMobile = useMedia("(max-width: 770px)")
	const { me } = useAccountOrGuest({
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

	const wantToLearnIndex =
		me?._type === "Anonymous" ? -1 : (me?.root.topicsWantToLearn.findIndex(t => t?.id === topic.id) ?? -1)
	if (wantToLearnIndex !== -1) {
		p = {
			index: wantToLearnIndex,
			topic: me && me._type !== "Anonymous" ? me.root.topicsWantToLearn[wantToLearnIndex] : undefined,
			learningState: "wantToLearn"
		}
	}

	const learningIndex =
		me?._type === "Anonymous" ? -1 : (me?.root.topicsLearning.findIndex(t => t?.id === topic.id) ?? -1)
	if (learningIndex !== -1) {
		p = {
			index: learningIndex,
			topic: me && me._type !== "Anonymous" ? me?.root.topicsLearning[learningIndex] : undefined,
			learningState: "learning"
		}
	}

	const learnedIndex =
		me?._type === "Anonymous" ? -1 : (me?.root.topicsLearned.findIndex(t => t?.id === topic.id) ?? -1)
	if (learnedIndex !== -1) {
		p = {
			index: learnedIndex,
			topic: me && me._type !== "Anonymous" ? me?.root.topicsLearned[learnedIndex] : undefined,
			learningState: "learned"
		}
	}

	const handleAddToProfile = (learningState: LearningStateValue) => {
		if (me?._type === "Anonymous") {
			return clerk.redirectToSignIn({
				redirectUrl: pathname
			})
		}

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
			<div className="flex min-w-0 flex-1 items-center gap-1.5">
				<SidebarToggleButton />
				<div className="flex min-h-0 min-w-0 flex-1 items-center">
					<h1 className="truncate text-left font-bold lg:text-xl">{topic.prettyName}</h1>
				</div>
			</div>

			<div className="flex flex-auto"></div>
			{/* <GuideCommunityToggle topicName={topic.name} /> */}

			<LearningStateSelector
				showSearch={false}
				value={p?.learningState || ""}
				onChange={handleAddToProfile}
				defaultLabel={isMobile ? "" : "Add to profile"}
				defaultIcon="Circle"
			/>
		</ContentHeader>
	)
})

TopicDetailHeader.displayName = "TopicDetailHeader"
