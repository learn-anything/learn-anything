import { Button } from "@/components/ui/button"
import { Command, CommandInput, CommandList, CommandItem, CommandGroup } from "@/components/ui/command"
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckIcon } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { cn } from "@/lib/utils"
import { useAtom } from "jotai"
import { linkTopicSelectorAtom } from "@/store/link"
import { LinkFormValues } from "../schema"
import { useCoState } from "@/lib/providers/jazz-provider"
import { PublicGlobalGroup } from "@/lib/schema/master/public-group"
import { ID } from "jazz-tools"
import { LaIcon } from "@/components/custom/la-icon"
import { Topic } from "@/lib/schema"

interface TopicSelectorProps {
	onSelect?: (value: Topic) => void
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({ onSelect }) => {
	const globalGroup = useCoState(
		PublicGlobalGroup,
		process.env.NEXT_PUBLIC_JAZZ_GLOBAL_GROUP as ID<PublicGlobalGroup>,
		{
			root: {
				topics: []
			}
		}
	)
	const [isTopicSelectorOpen, setIsTopicSelectorOpen] = useAtom(linkTopicSelectorAtom)
	const form = useFormContext<LinkFormValues>()

	const handleSelect = (value: string) => {
		const topic = globalGroup?.root.topics.find(topic => topic?.name === value)
		if (topic) {
			onSelect?.(topic)
			form?.setValue("topic", value)
		}
		setIsTopicSelectorOpen(false)
	}

	const selectedValue = form ? form.watch("topic") : null

	return (
		<Popover open={isTopicSelectorOpen} onOpenChange={setIsTopicSelectorOpen}>
			<PopoverTrigger asChild>
				<Button size="sm" type="button" role="combobox" variant="secondary" className="gap-x-2 text-sm">
					<span className="truncate">
						{selectedValue
							? globalGroup?.root.topics.find(topic => topic?.id && topic.name === selectedValue)?.prettyName
							: "Topic"}
					</span>
					<LaIcon name="ChevronDown" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="z-50 w-52 rounded-lg p-0"
				side="bottom"
				align="end"
				onCloseAutoFocus={e => e.preventDefault()}
			>
				<Command>
					<CommandInput placeholder="Search topic..." className="h-9" />
					<CommandList>
						<ScrollArea>
							<CommandGroup>
								{globalGroup?.root.topics.map(
									topic =>
										topic?.id && (
											<CommandItem key={topic.id} value={topic.name} onSelect={handleSelect}>
												{topic.prettyName}
												<CheckIcon
													size={16}
													className={cn(
														"absolute right-3",
														topic.name === selectedValue ? "text-primary" : "text-transparent"
													)}
												/>
											</CommandItem>
										)
								)}
							</CommandGroup>
						</ScrollArea>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
