import { Command } from "cmdk"
import { CommandSeparator, CommandShortcut } from "@/components/ui/command"
import { LaIcon } from "../la-icon"
import { CommandItemType } from "./command-data"

export interface CommandItemProps extends CommandItemType {
	handleAction: (action: string, payload?: any) => void
}

export const CommandItem: React.FC<CommandItemProps> = ({ icon, label, action, payload, shortcut, handleAction }) => (
	<Command.Item onSelect={() => handleAction(action, payload)}>
		{icon && <LaIcon name={icon} />}
		<span>{label}</span>
		{shortcut && <CommandShortcut>{shortcut}</CommandShortcut>}
	</Command.Item>
)

export interface CommandGroupProps {
	heading?: string
	items: CommandItemType[]
	handleAction: (action: string, payload?: any) => void
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
