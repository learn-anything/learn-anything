import { Button } from "@/components/ui/button"
import { Command, CommandInput, CommandList, CommandItem, CommandGroup } from "@/components/ui/command"
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useFormContext } from "react-hook-form"
import { cn } from "@/lib/utils"
import { LaIcon } from "@/components/custom/la-icon"
import { useAtom } from "jotai"
import { linkLearningStateSelectorAtom } from "@/store/link"
import { useMemo } from "react"
import { LinkFormValues } from "../schema"
import { LEARNING_STATES } from "@/lib/constants"

export const LearningStateSelector: React.FC = () => {
	const [islearningStateSelectorOpen, setIslearningStateSelectorOpen] = useAtom(linkLearningStateSelectorAtom)
	const form = useFormContext<LinkFormValues>()

	const selectedLearningState = useMemo(
		() => LEARNING_STATES.find(ls => ls.value === form.getValues("learningState")),
		[form]
	)

	return (
		<FormField
			control={form.control}
			name="learningState"
			render={({ field }) => (
				<FormItem className="space-y-0">
					<FormLabel className="sr-only">Topic</FormLabel>
					<Popover open={islearningStateSelectorOpen} onOpenChange={setIslearningStateSelectorOpen}>
						<PopoverTrigger asChild>
							<FormControl>
								<Button size="sm" type="button" role="combobox" variant="secondary" className="gap-x-2 text-sm">
									{selectedLearningState?.icon && (
										<LaIcon
											name={selectedLearningState.icon}
											className={cn("h-4 w-4", selectedLearningState.className)}
										/>
									)}
									<span className={cn("truncate", selectedLearningState?.className || "")}>
										{selectedLearningState?.label || "Select state"}
									</span>
									<LaIcon name="ChevronDown" size={16} />
								</Button>
							</FormControl>
						</PopoverTrigger>
						<PopoverContent
							className="w-52 rounded-lg p-0"
							side="bottom"
							align="end"
							onCloseAutoFocus={e => e.preventDefault()}
						>
							<Command>
								<CommandInput placeholder="Search state..." className="h-9" />
								<CommandList>
									<ScrollArea>
										<CommandGroup>
											{LEARNING_STATES.map(ls => (
												<CommandItem
													key={ls.value}
													value={ls.value}
													onSelect={value => {
														field.onChange(value)
														setIslearningStateSelectorOpen(false)
													}}
												>
													<LaIcon name={ls.icon} className={cn("mr-2", ls.className)} />
													<span className={ls.className}>{ls.label}</span>
													<LaIcon
														name="Check"
														size={16}
														className={cn(
															"absolute right-3",
															ls.value === field.value ? "text-primary" : "text-transparent"
														)}
													/>
												</CommandItem>
											))}
										</CommandGroup>
									</ScrollArea>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
				</FormItem>
			)}
		/>
	)
}
