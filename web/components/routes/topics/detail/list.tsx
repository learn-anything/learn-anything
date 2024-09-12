import React, { useRef } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Link as LinkSchema, Section as SectionSchema, Topic } from "@/lib/schema"
import { LinkItem } from "./partials/link-item"

export type FlattenedItem = { type: "link"; data: LinkSchema | null } | { type: "section"; data: SectionSchema | null }

interface TopicDetailListProps {
	items: FlattenedItem[]
	topic: Topic
	activeIndex: number
	setActiveIndex: (index: number) => void
}

export function TopicDetailList({ items, topic, activeIndex, setActiveIndex }: TopicDetailListProps) {
	const parentRef = useRef<HTMLDivElement>(null)

	const virtualizer = useVirtualizer({
		count: items.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 44
	})

	const rows = virtualizer.getVirtualItems()

	return (
		<div ref={parentRef} className="flex-1 overflow-auto">
			<div
				style={{
					height: virtualizer.getTotalSize(),
					width: "100%",
					position: "relative"
				}}
			>
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						transform: `translateY(${rows[0]?.start ?? 0}px)`
					}}
				>
					{rows.map(virtualRow =>
						items[virtualRow.index].type === "section" ? (
							<div
								key={virtualRow.key}
								data-index={virtualRow.index}
								ref={virtualizer.measureElement}
								className="flex flex-col"
							>
								<div className="flex items-center gap-4 px-6 py-2 max-lg:px-4">
									<p className="text-foreground text-sm font-medium">{items[virtualRow.index].data?.title}</p>
									<div className="flex-1 border-b"></div>
								</div>
							</div>
						) : (
							items[virtualRow.index].data?.id && (
								<LinkItem
									key={virtualRow.key}
									data-index={virtualRow.index}
									ref={virtualizer.measureElement}
									topic={topic}
									link={items[virtualRow.index].data as LinkSchema}
									isActive={activeIndex === virtualRow.index}
									index={virtualRow.index}
									setActiveIndex={setActiveIndex}
								/>
							)
						)
					)}
				</div>
			</div>
		</div>
	)
}
