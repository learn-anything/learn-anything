import { Button } from "@/components/ui/button"
import { Command, CommandInput, CommandList, CommandItem, CommandGroup } from "@/components/ui/command"
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckIcon, ChevronDownIcon } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { cn } from "@/lib/utils"
import { useAtom } from "jotai"
import { linkTopicSelectorAtom } from "@/store/link"
import { LinkFormValues } from "../schema"

const TOPICS = [
	{ id: "1", name: "Work" },
	{ id: "2", name: "Personal" }
]

export const TopicSelector: React.FC = () => {
	const [istopicSelectorOpen, setIstopicSelectorOpen] = useAtom(linkTopicSelectorAtom)
	const form = useFormContext<LinkFormValues>()

	return (
		<FormField
			control={form.control}
			name="topic"
			render={({ field }) => (
				<FormItem className="space-y-0">
					<FormLabel className="sr-only">Topic</FormLabel>
					<Popover open={istopicSelectorOpen} onOpenChange={setIstopicSelectorOpen}>
						<PopoverTrigger asChild>
							<FormControl>
								<Button size="sm" type="button" role="combobox" variant="secondary" className="gap-x-2 text-sm">
									<span className="truncate">
										{field.value ? TOPICS.find(topic => topic.name === field.value)?.name : "Topic"}
									</span>
									<ChevronDownIcon size={16} />
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
								<CommandInput placeholder="Search topic..." className="h-9" />
								<CommandList>
									<ScrollArea>
										<CommandGroup>
											{TOPICS.map(topic => (
												<CommandItem
													key={topic.id}
													value={topic.name}
													onClick={e => {
														e.preventDefault()
														e.stopPropagation()
													}}
													onSelect={value => {
														field.onChange(value)
														setIstopicSelectorOpen(false)
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
