import { Button } from "@/components/ui/button"
import { Command, CommandInput, CommandList, CommandItem, CommandGroup } from "@/components/ui/command"
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckIcon, ChevronDownIcon, icons } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { LinkFormValues } from "../link-form"
import { cn } from "@/lib/utils"
import { LaIcon } from "@/components/custom/la-icon"

type LearningState = {
	label: string
	value: string
	icon: keyof typeof icons
	color: string
}

const LEARNING_STATES: LearningState[] = [
	{ label: "To Learn", value: "wantToLearn", icon: "Bookmark", color: "text-foreground" },
	{ label: "Learning", value: "Learning", icon: "GraduationCap", color: "text-[#D29752]" },
	{ label: "Learned", value: "Learned", icon: "Check", color: "text-[#708F51]" }
]

export const LearningStateSection: React.FC = () => {
	const form = useFormContext<LinkFormValues>()
	const [open, setOpen] = useState(false)
	const { setValue } = useFormContext()

	return (
		<FormField
			control={form.control}
			name="learningState"
			render={({ field }) => (
				<FormItem>
					<FormLabel className="sr-only">Topic</FormLabel>
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<FormControl>
								<Button size="sm" type="button" role="combobox" variant="secondary" className="!mt-0 gap-x-2 text-sm">
									<span className="truncate">
										{field.value ? LEARNING_STATES.find(ls => ls.value === field.value)?.value : "Select state"}
									</span>
									<ChevronDownIcon size={16} />
								</Button>
							</FormControl>
						</PopoverTrigger>
						<PopoverContent
							className="w-52 rounded-lg p-0"
							side="bottom"
							align="end"
							onCloseAutoFocus={e => {
								e.preventDefault()
								e.stopPropagation()
							}}
							onFocusCapture={e => {
								e.preventDefault()
								e.stopPropagation()
							}}
							onInteractOutside={e => {
								e.preventDefault()
								e.stopPropagation()
							}}
							onEscapeKeyDown={e => {
								e.preventDefault()
								e.stopPropagation()
							}}
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
														setValue("learningState", value)
														setOpen(false)
													}}
												>
													<LaIcon name={ls.icon} className={cn("mr-2", ls.color)} />
													<span>{ls.label}</span>
													<CheckIcon
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
