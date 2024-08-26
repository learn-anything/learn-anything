import React, { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Command, CommandInput, CommandList, CommandItem, CommandGroup } from "@/components/ui/command"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { LaIcon } from "@/components/custom/la-icon"
import { LEARNING_STATES, LearningStateValue } from "@/lib/constants"
import { useAtom } from "jotai"
import { linkLearningStateSelectorAtom } from "@/store/link"

interface LearningStateSelectorProps {
	defaultLabel?: string
	searchPlaceholder?: string
	value: string
	onChange: (value: LearningStateValue) => void
	className?: string
}

export const LearningStateSelector: React.FC<LearningStateSelectorProps> = ({
	defaultLabel = "Select state",
	searchPlaceholder = "Search state...",
	value,
	onChange,
	className
}) => {
	const [islearningStateSelectorOpen, setIslearningStateSelectorOpen] = useAtom(linkLearningStateSelectorAtom)

	const selectedLearningState = useMemo(() => LEARNING_STATES.find(ls => ls.value === value), [value])

	return (
		<Popover open={islearningStateSelectorOpen} onOpenChange={setIslearningStateSelectorOpen}>
			<PopoverTrigger asChild>
				<Button
					size="sm"
					type="button"
					role="combobox"
					variant="secondary"
					className={cn("gap-x-2 text-sm", className)}
				>
					{selectedLearningState?.icon && (
						<LaIcon name={selectedLearningState.icon} className={cn("h-4 w-4", selectedLearningState.className)} />
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
				<Command>
					<CommandInput placeholder={searchPlaceholder} className="h-9" />
					<CommandList>
						<ScrollArea>
							<CommandGroup>
								{LEARNING_STATES.map(ls => (
									<CommandItem
										key={ls.value}
										value={ls.value}
										onSelect={selectedValue => {
											onChange(selectedValue as LearningStateValue)
											setIslearningStateSelectorOpen(false)
										}}
									>
										<LaIcon name={ls.icon} className={cn("mr-2", ls.className)} />
										<span className={ls.className}>{ls.label}</span>
										<LaIcon
											name="Check"
											size={16}
											className={cn("absolute right-3", ls.value === value ? "text-primary" : "text-transparent")}
										/>
									</CommandItem>
								))}
							</CommandGroup>
						</ScrollArea>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
