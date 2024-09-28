import * as React from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import { Editor, Content } from "@tiptap/core"
import { BubbleMenu } from "./components/bubble-menu"
import { createExtensions } from "./extensions"
import "./styles/index.css"
import { cn } from "@/lib/utils"
import { getOutput } from "./lib/utils"
import type { EditorView } from "@tiptap/pm/view"
import { useThrottle } from "@/hooks/use-throttle"

export interface LAEditorProps extends Omit<React.HTMLProps<HTMLDivElement>, "value"> {
	output?: "html" | "json" | "text"
	placeholder?: string
	editorClassName?: string
	onUpdate?: (content: Content) => void
	onBlur?: (content: Content) => void
	onNewBlock?: (content: Content) => void
	handleKeyDown?: (view: EditorView, event: KeyboardEvent) => boolean
	value?: any
	throttleDelay?: number
}

export interface LAEditorRef {
	editor: Editor | null
}

export const LAEditor = React.forwardRef<LAEditorRef, LAEditorProps>(
	(
		{
			value,
			placeholder,
			output = "html",
			editorClassName,
			className,
			onUpdate,
			onBlur,
			onNewBlock,
			handleKeyDown,
			throttleDelay = 1000,
			...props
		},
		ref
	) => {
		const throttledSetValue = useThrottle((value: Content) => onUpdate?.(value), throttleDelay)

		const handleUpdate = React.useCallback(
			(editor: Editor) => {
				throttledSetValue(getOutput(editor, output))
			},
			[output, throttledSetValue]
		)

		const editor = useEditor({
			autofocus: false,
			immediatelyRender: false,
			extensions: createExtensions({ placeholder }),
			editorProps: {
				attributes: {
					autocomplete: "off",
					autocorrect: "off",
					autocapitalize: "off",
					class: editorClassName || ""
				},
				handleKeyDown
			},
			onCreate: ({ editor }) => {
				editor.commands.setContent(value)
			},
			onUpdate: ({ editor }) => handleUpdate(editor),
			onBlur: ({ editor }) => {
				onBlur?.(getOutput(editor, output))
			}
		})

		React.useImperativeHandle(
			ref,
			() => ({
				editor: editor
			}),
			[editor]
		)

		if (!editor) {
			return null
		}

		return (
			<div className={cn("la-editor relative flex h-full w-full grow flex-col", className)} {...props}>
				<EditorContent editor={editor} />
				<BubbleMenu editor={editor} />
			</div>
		)
	}
)

LAEditor.displayName = "LAEditor"

export default LAEditor
