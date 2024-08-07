import { Button } from "@/components/ui/button"
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command"
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckIcon, ChevronDownIcon } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { LinkFormValues } from "../manage"
import { cn } from "@/lib/utils"

const TOPICS = [
	{ id: "1", name: "Work" },
	{ id: "2", name: "Personal" }
]

export const TopicSelector: React.FC = () => {
	const form = useFormContext<LinkFormValues>()
	const [open, setOpen] = useState(false)
	const { setValue } = useFormContext()

	return (
		<FormField
			control={form.control}
			name="topic"
			render={({ field }) => (
				<FormItem>
					<FormLabel className="sr-only">Topic</FormLabel>
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<FormControl>
								<Button size="sm" type="button" role="combobox" variant="secondary" className="!mt-0 gap-x-2 text-sm">
									<span className="truncate">
										{field.value ? TOPICS.find(topic => topic.name === field.value)?.name : "Select topic"}
									</span>
									<ChevronDownIcon size={16} />
								</Button>
							</FormControl>
						</PopoverTrigger>
						<PopoverContent className="w-52 rounded-lg p-0" side="right" align="start">
							<Command>
								<CommandInput placeholder="Search topic..." className="h-9" />
								<CommandList>
									<ScrollArea>
										{TOPICS.map(topic => (
											<CommandItem
												className="cursor-pointer"
												key={topic.id}
												value={topic.name}
												onSelect={value => {
													setValue("topic", value)
													setOpen(false)
												}}
											>
												{topic.name}
												<CheckIcon
													size={16}
													className={cn(
														"absolute right-3",
														topic.name === field.value ? "text-primary" : "text-transparent"
													)}
												/>
											</CommandItem>
										))}
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
