import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAccount } from "@/lib/providers/jazz-provider"
import { cn } from "@/lib/utils"
import { LaIcon } from "@/components/custom/la-icon"
import { ListOfTopics } from "@/lib/schema"
import { LEARNING_STATES, LearningStateValue } from "@/lib/constants"

export const TopicSection: React.FC<{ pathname: string }> = ({ pathname }) => {
	const { me } = useAccount({
		root: {
			topicsWantToLearn: [],
			topicsLearning: [],
			topicsLearned: []
		}
	})

	const topicCount =
		(me?.root.topicsWantToLearn?.length || 0) +
		(me?.root.topicsLearning?.length || 0) +
		(me?.root.topicsLearned?.length || 0)

	const isActive = pathname.startsWith("/topics")

	if (!me) return null

	return (
		<div className="group/topics flex flex-col gap-px py-2">
			<TopicSectionHeader topicCount={topicCount} isActive={isActive} />
			<List
				topicsWantToLearn={me.root.topicsWantToLearn}
				topicsLearning={me.root.topicsLearning}
				topicsLearned={me.root.topicsLearned}
			/>
		</div>
	)
}

interface TopicSectionHeaderProps {
	topicCount: number
	isActive: boolean
}

const TopicSectionHeader: React.FC<TopicSectionHeaderProps> = ({ topicCount, isActive }) => (
	<div
		className={cn(
			"flex h-9 items-center gap-px rounded-md sm:h-[30px]",
			isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
		)}
	>
		<Link href="/topics" className="flex flex-1 items-center justify-start rounded-md px-2 py-1">
			<p className="text-sm sm:text-xs">
				Topics
				{topicCount > 0 && <span className="text-muted-foreground ml-1">{topicCount}</span>}
			</p>
		</Link>
	</div>
)

interface ListProps {
	topicsWantToLearn: ListOfTopics
	topicsLearning: ListOfTopics
	topicsLearned: ListOfTopics
}

const List: React.FC<ListProps> = ({ topicsWantToLearn, topicsLearning, topicsLearned }) => {
	const pathname = usePathname()

	return (
		<div className="flex flex-col gap-px">
			<ListItem
				key={topicsWantToLearn.id}
				count={topicsWantToLearn.length}
				label="To Learn"
				value="wantToLearn"
				href="#"
				isActive={pathname === "/me/wantToLearn"}
			/>
			<ListItem
				key={topicsLearning.id}
				label="Learning"
				value="learning"
				count={topicsLearning.length}
				href="#"
				isActive={pathname === "/me/learning"}
			/>
			<ListItem
				key={topicsLearned.id}
				label="Learned"
				value="learned"
				count={topicsLearned.length}
				href="#"
				isActive={pathname === "/me/learned"}
			/>
		</div>
	)
}

interface ListItemProps {
	label: string
	value: LearningStateValue
	href: string
	count: number
	isActive: boolean
}

const ListItem: React.FC<ListItemProps> = ({ label, value, href, count, isActive }) => {
	const le = LEARNING_STATES.find(l => l.value === value)

	if (!le) return null

	return (
		<div className="group/reorder-page relative">
			<div className="group/topic-link relative flex min-w-0 flex-1">
				<Link
					href={href}
					className={cn(
						"group-hover/topic-link:bg-accent relative flex h-9 w-full items-center gap-2 rounded-md p-1.5 font-medium sm:h-8",
						{ "bg-accent text-accent-foreground": isActive },
						le.className
					)}
				>
					<div className="flex max-w-full flex-1 items-center gap-1.5 truncate text-sm">
						<LaIcon name={le.icon} className="flex-shrink-0 opacity-60" />
						<p className={cn("truncate opacity-95 group-hover/topic-link:opacity-100", le.className)}>{label}</p>
					</div>
				</Link>

				{count > 0 && (
					<span className="absolute right-2 top-1/2 z-[1] -translate-y-1/2 rounded p-1 text-sm">{count}</span>
				)}
			</div>
		</div>
	)
}
