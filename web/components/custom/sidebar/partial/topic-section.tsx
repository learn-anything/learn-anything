import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { LaIcon } from "@/components/custom/la-icon"
import { SidebarItem } from "../sidebar"

// const TOPICS = ["Nix", "Javascript", "Kubernetes", "Figma", "Hiring", "Java", "IOS", "Design"]

export const TopicSection = () => {
	const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
	const sectionRef = useRef<HTMLDivElement>(null)

	const learningOptions = [
		{
			text: "To Learn",
			icon: <LaIcon name="NotebookPen" className="size-3 flex-shrink-0" />,
			color: "text-black dark:text-white"
		},
		{
			text: "Learning",
			icon: <LaIcon name="GraduationCap" className="size-4 flex-shrink-0" />,
			color: "text-[#D29752]"
		},
		{ text: "Learned", icon: <LaIcon name="Check" className="size-4 flex-shrink-0" />, color: "text-[#708F51]" }
	]

	const getStatusColor = (status: string | null) => {
		if (!status) return "text-foreground"
		const option = learningOptions.find(opt => opt.text === status)
		return option ? option.color : "text-foreground"
	}

	const statusSelect = (status: string) => {
		setSelectedStatus(prevStatus => (prevStatus === status ? null : status))
	}

	const topicCounts = {
		"To Learn": 2,
		Learning: 5,
		Learned: 3,
		get total() {
			return this["To Learn"] + this.Learning + this.Learned
		}
	}

	return (
		<div className="space-y-1 overflow-hidden" ref={sectionRef}>
			<div className="text-foreground group/topics flex w-full items-center justify-between rounded-md px-2 py-2 text-xs font-medium hover:bg-neutral-100">
				<span className={getStatusColor(selectedStatus)}>
					<span className="text-black dark:text-white">Topics</span>
					{selectedStatus ? `: ${selectedStatus}` : ""}{" "}
					{selectedStatus ? topicCounts[selectedStatus as keyof typeof topicCounts] : topicCounts.total} {/* </span> */}
				</span>
				<button className="opacity-0 transition-opacity duration-200 group-hover/topics:opacity-100">
					<LaIcon name="Ellipsis" className="size-4 flex-shrink-0" />
				</button>
			</div>
			<div>
				{learningOptions.map(option => (
					<Button
						key={option.text}
						onClick={() => statusSelect(option.text)}
						className={`flex w-full items-center justify-between rounded-md py-1 pl-1 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-100/20 ${option.color} bg-inherit shadow-none`}
					>
						<div className="flex items-center gap-2">
							{option.icon && <span className={option.color}>{option.icon}</span>}
							<span>{option.text}</span>
						</div>
						<span className="option.color mr-2">{topicCounts[option.text as keyof typeof topicCounts]}</span>
					</Button>
				))}
			</div>
		</div>
	)
}
