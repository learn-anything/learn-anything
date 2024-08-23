import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
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
			<div className="bg-accent text-foreground flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium">
				<span>{selectedStatus ? `Topics: ${selectedStatus}` : "Topics"}</span>
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
			<div className="scrollbar-hide space-y-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
				{TOPICS.map(topic => (
					<SidebarItem key={topic} label={topic} url={`/${topic}`} />
				))}
			</div>
		</div>
	)
}
