<<<<<<< HEAD
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { LaIcon } from "@/components/custom/la-icon"
import { SidebarItem } from "../sidebar"

const TOPICS = ["Nix", "Javascript", "Kubernetes", "Figma", "Hiring", "Java", "IOS", "Design"]

export const TopicSection = () => {
	const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
	const sectionRef = useRef<HTMLDivElement>(null)

	const learningOptions = [
		{ text: "To Learn", icon: <LaIcon name="NotebookPen" />, color: "text-black dark:text-white" },
		{ text: "Learning", icon: <LaIcon name="GraduationCap" />, color: "text-[#D29752]" },
		{ text: "Learned", icon: <LaIcon name="Check" />, color: "text-[#708F51]" }
	]

	const getStatusColor = (status: string | null) => {
		if (!status) return "text-foreground"
		const option = learningOptions.find(opt => opt.text === status)
		return option ? option.color : "text-foreground"
	}

	const statusSelect = (status: string) => {
		setSelectedStatus(status === "Show All" ? null : status)
	}

	const availableOptions = [
		{
			text: "Show All",
			icon: <LaIcon name="BookOpen" />,
			color: "text-black dark:text-white"
		},
		...learningOptions
	]

	return (
		<div className="space-y-1 overflow-hidden" ref={sectionRef}>
			<div className="text-foreground flex w-full items-center justify-between rounded-md px-2 py-2 text-xs font-medium">
				<span className={getStatusColor(selectedStatus)}>
					{selectedStatus ? `Topics: ${selectedStatus}` : "Topics"}
				</span>
			</div>

			<div className="rounded-lg border border-neutral-200 bg-inherit dark:border-neutral-700">
				{availableOptions.map(option => (
					<Button
						key={option.text}
						onClick={() => statusSelect(option.text)}
						className={`flex w-full items-center justify-start space-x-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-100/20 ${option.color} bg-inherit shadow-none`}
					>
						{option.icon && <span className={option.color}>{option.icon}</span>}
						<span>{option.text}</span>
					</Button>
				))}
			</div>
			<div className="scrollbar-hide space-y-1 overflow-y-auto opacity-70" style={{ maxHeight: "calc(100vh - 200px)" }}>
				{TOPICS.map(topic => (
					<SidebarItem key={topic} label={topic} url={`/${topic}`} />
				))}
=======
import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAccount } from "@/lib/providers/jazz-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LaIcon } from "@/components/custom/la-icon"
import { ListOfTopics } from "@/lib/schema"
import { LEARNING_STATES, LearningStateValue } from "@/lib/constants"

export const TopicSection: React.FC = () => {
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

	if (!me) return null

	return (
		<div className="group/pages flex flex-col gap-px py-2">
			<TopicSectionHeader topicCount={topicCount} />
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
}

const TopicSectionHeader: React.FC<TopicSectionHeaderProps> = ({ topicCount }) => (
	<div
		className={cn("flex min-h-[30px] items-center gap-px rounded-md", "hover:bg-accent hover:text-accent-foreground")}
	>
		<Button
			variant="ghost"
			className="size-6 flex-1 items-center justify-start rounded-md px-2 py-1 focus-visible:outline-none focus-visible:ring-0"
		>
			<p className="flex items-center text-xs font-medium">
				Topics
				{topicCount && <span className="text-muted-foreground ml-1">{topicCount}</span>}
			</p>
		</Button>
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
				href="/me/wantToLearn"
				isActive={pathname === "/me/wantToLearn"}
			/>
			<ListItem
				key={topicsLearning.id}
				label="Learning"
				value="learning"
				count={topicsLearning.length}
				href="/me/learning"
				isActive={pathname === "/me/learning"}
			/>
			<ListItem
				key={topicsLearned.id}
				label="Learned"
				value="learned"
				count={topicsLearned.length}
				href="/me/learned"
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
						"group-hover/topic-link:bg-accent relative flex h-8 w-full items-center gap-2 rounded-md p-1.5 font-medium",
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
>>>>>>> 7c68b66b7a987fc9b616fcc1d7581056ec630058
			</div>
		</div>
	)
}
