import { Command } from "cmdk"
import { CommandSeparator, CommandShortcut } from "@/components/ui/command"
import { LaIcon } from "../la-icon"
import { CommandItemType, CommandAction } from "./command-data"
import { HTMLLikeElement, renderHTMLLikeElement } from "@/lib/utils"

export interface CommandItemProps extends Omit<CommandItemType, "action"> {
	action: CommandAction
	handleAction: (action: CommandAction, payload?: any) => void
}

const HTMLLikeRenderer: React.FC<{ content: HTMLLikeElement | string }> = ({ content }) => {
	return <>{renderHTMLLikeElement(content)}</>
}

export const CommandItem: React.FC<CommandItemProps> = ({ icon, label, action, payload, shortcut, handleAction }) => (
	<Command.Item onSelect={() => handleAction(action, payload)}>
		{icon && <LaIcon name={icon} />}
		<HTMLLikeRenderer content={label} />
		{shortcut && <CommandShortcut>{shortcut}</CommandShortcut>}
	</Command.Item>
)
export interface CommandGroupProps {
	heading?: string
	items: CommandItemType[]
	handleAction: (action: CommandAction, payload?: any) => void
	isLastGroup: boolean
}

export const CommandGroup: React.FC<CommandGroupProps> = ({ heading, items, handleAction, isLastGroup }) => {
	return (
		<>
			{heading ? (
				<Command.Group heading={heading}>
					{items.map((item, index) => (
						<CommandItem key={`${heading}-${item.label}-${index}`} {...item} handleAction={handleAction} />
					))}
				</Command.Group>
			) : (
				items.map((item, index) => (
					<CommandItem key={`item-${item.label}-${index}`} {...item} handleAction={handleAction} />
				))
			)}
			{!isLastGroup && <CommandSeparator className="my-1.5" />}
		</>
	)
}
