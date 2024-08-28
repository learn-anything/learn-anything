import React, { useMemo } from "react"
import { useAtom } from "jotai"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { LaIcon } from "@/components/custom/la-icon"
import { LEARNING_STATES, LearningStateValue } from "@/lib/constants"
import { linkLearningStateSelectorAtom } from "@/store/link"
import { Command, CommandInput, CommandList, CommandItem, CommandGroup } from "@/components/ui/command"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LearningStateSelectorProps {
	showSearch?: boolean
	defaultLabel?: string
	searchPlaceholder?: string
	value?: string
	onChange: (value: LearningStateValue) => void
	className?: string
}

export const LearningStateSelector: React.FC<LearningStateSelectorProps> = ({
	showSearch = true,
	defaultLabel = "Select state",
	searchPlaceholder = "Search state...",
	value,
	onChange,
	className
}) => {
	const [isLearningStateSelectorOpen, setIsLearningStateSelectorOpen] = useAtom(linkLearningStateSelectorAtom)
	const selectedLearningState = useMemo(() => LEARNING_STATES.find(ls => ls.value === value), [value])

	const handleSelect = (selectedValue: string) => {
		onChange(selectedValue as LearningStateValue)
		setIsLearningStateSelectorOpen(false)
	}

	return (
		<Popover open={isLearningStateSelectorOpen} onOpenChange={setIsLearningStateSelectorOpen}>
			<PopoverTrigger asChild>
				<Button
					size="sm"
					type="button"
					role="combobox"
					variant="secondary"
					className={cn("gap-x-2 text-sm", className)}
				>
					{selectedLearningState?.icon && (
						<LaIcon name={selectedLearningState.icon} className={cn(selectedLearningState.className)} />
					)}
					<span className={cn("truncate", selectedLearningState?.className || "")}>
						{selectedLearningState?.label || defaultLabel}
					</span>
					<LaIcon name="ChevronDown" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-52 rounded-lg p-0"
				side="bottom"
				align="end"
				onCloseAutoFocus={e => e.preventDefault()}
			>
				<LearningStateSelectorContent
					showSearch={showSearch}
					searchPlaceholder={searchPlaceholder}
					value={value}
					onSelect={handleSelect}
				/>
			</PopoverContent>
		</Popover>
	)
}

interface LearningStateSelectorContentProps {
	showSearch: boolean
	searchPlaceholder: string
	value?: string
	onSelect: (value: string) => void
}

export const LearningStateSelectorContent: React.FC<LearningStateSelectorContentProps> = ({
	showSearch,
	searchPlaceholder,
	value,
	onSelect
}) => {
	return (
		<Command>
			{showSearch && <CommandInput placeholder={searchPlaceholder} className="h-9" />}
			<CommandList>
				<ScrollArea>
					<CommandGroup>
						{LEARNING_STATES.map(ls => (
							<CommandItem key={ls.value} value={ls.value} onSelect={onSelect}>
								<LaIcon name={ls.icon} className={cn("mr-2", ls.className)} />
								<span className={ls.className}>{ls.label}</span>
								<LaIcon
									name="Check"
									className={cn("absolute right-3", ls.value === value ? "text-primary" : "text-transparent")}
								/>
							</CommandItem>
						))}
					</CommandGroup>
				</ScrollArea>
			</CommandList>
		</Command>
	)
}