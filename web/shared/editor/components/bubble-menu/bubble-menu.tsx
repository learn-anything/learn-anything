import { useTextmenuCommands } from "../../hooks/use-text-menu-commands"
import { PopoverWrapper } from "../ui/popover-wrapper"
import { useTextmenuStates } from "../../hooks/use-text-menu-states"
import { BubbleMenu as TiptapBubbleMenu, Editor } from "@tiptap/react"
import { ToolbarButton } from "../ui/toolbar-button"
import { Icon } from "../ui/icon"

export type BubbleMenuProps = {
  editor: Editor
}

export const BubbleMenu = ({ editor }: BubbleMenuProps) => {
  const commands = useTextmenuCommands(editor)
  const states = useTextmenuStates(editor)

  return (
    <TiptapBubbleMenu
      tippyOptions={{
        // duration: [0, 999999],
        popperOptions: { placement: "top-start" },
      }}
      editor={editor}
      pluginKey="textMenu"
      shouldShow={states.shouldShow}
      updateDelay={100}
    >
      <PopoverWrapper>
        <div className="flex space-x-1">
          <ToolbarButton
            value="bold"
            aria-label="Bold"
            onPressedChange={commands.onBold}
            isActive={states.isBold}
          >
            <Icon name="Bold" strokeWidth={2.5} />
          </ToolbarButton>

          <ToolbarButton
            value="italic"
            aria-label="Italic"
            onClick={commands.onItalic}
            isActive={states.isItalic}
          >
            <Icon name="Italic" strokeWidth={2.5} />
          </ToolbarButton>

          <ToolbarButton
            value="strikethrough"
            aria-label="Strikethrough"
            onClick={commands.onStrike}
            isActive={states.isStrike}
          >
            <Icon name="Strikethrough" strokeWidth={2.5} />
          </ToolbarButton>

          <ToolbarButton
            value="quote"
            aria-label="Quote"
            onClick={commands.onCode}
            isActive={states.isCode}
          >
            <Icon name="Quote" strokeWidth={2.5} />
          </ToolbarButton>

          <ToolbarButton
            value="inline code"
            aria-label="Inline code"
            onClick={commands.onCode}
            isActive={states.isCode}
          >
            <Icon name="Braces" strokeWidth={2.5} />
          </ToolbarButton>

          <ToolbarButton
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
