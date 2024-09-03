import React, { useMemo, useCallback, useRef, forwardRef } from "react"
import { atom, useAtom } from "jotai"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { LaIcon } from "@/components/custom/la-icon"
import { Command, CommandInput, CommandList, CommandItem, CommandGroup } from "@/components/ui/command"
import { useCoState } from "@/lib/providers/jazz-provider"
import { PublicGlobalGroup } from "@/lib/schema/master/public-group"
import { ListOfTopics } from "@/lib/schema"
import { JAZZ_GLOBAL_GROUP_ID } from "@/lib/constants"

interface TopicSelectorProps {
	showSearch?: boolean
	defaultLabel?: string
	searchPlaceholder?: string
	value?: string | null
	onChange?: (value: string) => void
	className?: string
	renderSelectedText?: (value?: string | null) => React.ReactNode
}

export const topicSelectorAtom = atom(false)

export const TopicSelector = forwardRef<HTMLButtonElement, TopicSelectorProps>(
	(
		{
			showSearch = true,
			defaultLabel = "Select topic",
			searchPlaceholder = "Search topic...",
			value,
			onChange,
			className,
			renderSelectedText
		},
		ref
	) => {
		const [isTopicSelectorOpen, setIsTopicSelectorOpen] = useAtom(topicSelectorAtom)
		const group = useCoState(PublicGlobalGroup, JAZZ_GLOBAL_GROUP_ID, { root: { topics: [] } })

		const handleSelect = useCallback(
			(selectedTopicName: string) => {
				onChange?.(selectedTopicName)
				setIsTopicSelectorOpen(false)
			},
			[onChange, setIsTopicSelectorOpen]
		)

		const displaySelectedText = useMemo(() => {
			if (renderSelectedText) {
				return renderSelectedText(value)
			}
			return <span className="truncate">{value || defaultLabel}</span>
		}, [value, defaultLabel, renderSelectedText])

		return (
			<Popover open={isTopicSelectorOpen} onOpenChange={setIsTopicSelectorOpen}>
				<PopoverTrigger asChild>
					<Button
						ref={ref}
						size="sm"
						type="button"
						role="combobox"
						variant="secondary"
						className={cn("gap-x-2 text-sm", className)}
					>
						{displaySelectedText}
						<LaIcon name="ChevronDown" />
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="w-52 rounded-lg p-0"
					side="bottom"
					align="end"
					onCloseAutoFocus={e => e.preventDefault()}
				>
					{group?.root.topics && (
						<TopicSelectorContent
							showSearch={showSearch}
							searchPlaceholder={searchPlaceholder}
							value={value}
							onSelect={handleSelect}
							topics={group.root.topics}
						/>
					)}
				</PopoverContent>
			</Popover>
		)
	}
)

TopicSelector.displayName = "TopicSelector"

interface TopicSelectorContentProps extends Omit<TopicSelectorProps, "onChange"> {
	onSelect: (value: string) => void
	topics: ListOfTopics
}

const TopicSelectorContent: React.FC<TopicSelectorContentProps> = React.memo(
	({ showSearch, searchPlaceholder, value, onSelect, topics }) => {
		const [search, setSearch] = React.useState("")
		const filteredTopics = useMemo(
			() => topics.filter(topic => topic?.prettyName.toLowerCase().includes(search.toLowerCase())),
			[topics, search]
		)

		const parentRef = useRef<HTMLDivElement>(null)

		const rowVirtualizer = useVirtualizer({
			count: filteredTopics.length,
			getScrollElement: () => parentRef.current,
			estimateSize: () => 35,
			overscan: 5
		})

		return (
			<Command>
				{showSearch && (
					<CommandInput placeholder={searchPlaceholder} className="h-9" value={search} onValueChange={setSearch} />
				)}
				<CommandList>
					<div ref={parentRef} style={{ height: "200px", overflow: "auto" }}>
						<div
							style={{
								height: `${rowVirtualizer.getTotalSize()}px`,
								width: "100%",
								position: "relative"
							}}
						>
							<CommandGroup>
								{rowVirtualizer.getVirtualItems().map(virtualRow => {
									const topic = filteredTopics[virtualRow.index]
									return (
										topic && (
											<CommandItem
												key={virtualRow.key}
												value={topic.name}
												onSelect={onSelect}
												style={{
													position: "absolute",
													top: 0,
													left: 0,
													width: "100%",
													height: `${virtualRow.size}px`,
													transform: `translateY(${virtualRow.start}px)`
												}}
											>
												<span>{topic.prettyName}</span>
												<LaIcon
													name="Check"
													className={cn("absolute right-3", topic.name === value ? "text-primary" : "text-transparent")}
												/>
											</CommandItem>
										)
									)
								})}
							</CommandGroup>
						</div>
					</div>
				</CommandList>
			</Command>
		)
	}
)

TopicSelectorContent.displayName = "TopicSelectorContent"

export default TopicSelector
