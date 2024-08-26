import { useTextmenuCommands } from "../../hooks/use-text-menu-commands"
import { PopoverWrapper } from "../ui/popover-wrapper"
import { useTextmenuStates } from "../../hooks/use-text-menu-states"
import { BubbleMenu as TiptapBubbleMenu, Editor } from "@tiptap/react"
import { ToolbarButton } from "../ui/toolbar-button"
import { Icon } from "../ui/icon"
import * as React from "react"
import { Keybind } from "@/components/ui/Keybind"

export type BubbleMenuProps = {
	editor: Editor
}

export const BubbleMenu = ({ editor }: BubbleMenuProps) => {
	const commands = useTextmenuCommands(editor)
	const states = useTextmenuStates(editor)

	const toolbarButtonClassname =
		"hover:opacity-100 transition-all  dark:border-slate-500/10 border-gray-400 hover:border-b-2 active:translate-y-0 hover:translate-y-[-1.5px] hover:bg-zinc-300 dark:hover:bg-neutral-800 shadow-md rounded-[10px]"

	return (
		<TiptapBubbleMenu
			tippyOptions={{
				// duration: [0, 999999],
				popperOptions: { placement: "top-start" }
			}}
			className="flex h-[40px] min-h-[40px] items-center rounded-[14px] shadow-md"
			editor={editor}
			pluginKey="textMenu"
			shouldShow={states.shouldShow}
			updateDelay={100}
		>
			<PopoverWrapper
				className="flex items-center rounded-[14px] border border-slate-400/10 bg-gray-100 p-[4px] dark:bg-[#121212]"
				style={{
					boxShadow: "inset 0px 0px 5px 3px var(--boxShadow)"
				}}
			>
				<div className="flex space-x-1">
					<Keybind keys={["Ctrl", "I"]}>
						<ToolbarButton
							className={toolbarButtonClassname}
							value="bold"
							aria-label="Bold"
							onPressedChange={commands.onBold}
							isActive={states.isBold}
						>
							<Icon name="Bold" strokeWidth={2.5} />
						</ToolbarButton>
					</Keybind>

					<Keybind keys={["Ctrl", "U"]}>
						<ToolbarButton
							className={toolbarButtonClassname}
							value="italic"
							aria-label="Italic"
							onClick={commands.onItalic}
							isActive={states.isItalic}
						>
							<Icon name="Italic" strokeWidth={2.5} />
						</ToolbarButton>
					</Keybind>
					<Keybind keys={["Ctrl", "S"]}>
						<ToolbarButton
							className={toolbarButtonClassname}
							value="strikethrough"
							aria-label="Strikethrough"
							onClick={commands.onStrike}
							isActive={states.isStrike}
						>
							<Icon name="Strikethrough" strokeWidth={2.5} />
						</ToolbarButton>
					</Keybind>
					{/* <ToolbarButton value="link" aria-label="Link">
            <Icon name="Link" strokeWidth={2.5} />
          </ToolbarButton> */}
					<Keybind keys={["cmd", "K"]}>
						<ToolbarButton
							className={toolbarButtonClassname}
							value="quote"
							aria-label="Quote"
							onClick={commands.onCode}
							isActive={states.isCode}
						>
							<Icon name="Quote" strokeWidth={2.5} />
						</ToolbarButton>
					</Keybind>
					<Keybind keys={["Ctrl", "O"]}>
						<ToolbarButton
							className={toolbarButtonClassname}
							value="inline code"
							aria-label="Inline code"
							onClick={commands.onCode}
							isActive={states.isCode}
						>
							<Icon name="Braces" strokeWidth={2.5} />
						</ToolbarButton>
					</Keybind>
					<ToolbarButton
						className={toolbarButtonClassname}
						value="code block"
						aria-label="Code block"
						onClick={commands.onCodeBlock}
					>
						<Icon name="Code" strokeWidth={2.5} />
					</ToolbarButton>
					{/* <ToolbarButton value="list" aria-label="List">
            <Icon name="List" strokeWidth={2.5} />
          </ToolbarButton> */}
				</div>
			</PopoverWrapper>
		</TiptapBubbleMenu>
	)
}

export default BubbleMenu
