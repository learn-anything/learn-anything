import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useMedia } from "react-use"
import { useColumnStyles } from "../hooks/use-column-styles"
import { Topic } from "@/lib/schema"
import { Column } from "@/components/custom/column"

interface TopicItemProps {
	topic: Topic
	isActive: boolean
}

export const TopicItem = React.forwardRef<HTMLAnchorElement, TopicItemProps>(({ topic, isActive }, ref) => {
	const isTablet = useMedia("(max-width: 640px)")
	const columnStyles = useColumnStyles()

	return (
		<Link
			ref={ref}
			tabIndex={isActive ? 0 : -1}
			className={cn("relative block cursor-default outline-none", "min-h-12 py-2 max-lg:px-4 sm:px-6", {
				"bg-muted-foreground/5": isActive,
				"hover:bg-muted/50": !isActive
			})}
			href={`/topics/${topic.id}`}
			role="listitem"
		>
			<div className="flex h-full items-center gap-4">
				<Column.Wrapper style={columnStyles.title}>
					<Column.Text className="truncate text-[13px] font-medium">{topic.prettyName}</Column.Text>
				</Column.Wrapper>

				{!isTablet && (
					<Column.Wrapper style={columnStyles.topic}>
						{topic && <Badge variant="secondary">{topic.prettyName}</Badge>}
					</Column.Wrapper>
				)}

				<Column.Wrapper style={columnStyles.updated} className="flex justify-end">
					<Column.Text className="text-[13px]">{topic.name}</Column.Text>
				</Column.Wrapper>
			</div>
		</Link>
	)
})

TopicItem.displayName = "TopicItem"
