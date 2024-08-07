"use client"

import * as React from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import { Editor, Content } from "@tiptap/core"
import { useThrottleFn } from "react-use"
import { BubbleMenu } from "./components/bubble-menu"
import { createExtensions } from "./extensions"
import "./styles/index.css"
import { cn } from "@/lib/utils"
import { getOutput } from "./lib/utils"

export interface LAEditorProps extends Omit<React.HTMLProps<HTMLDivElement>, "value"> {
	initialContent?: any
	output?: "html" | "json" | "text"
	placeholder?: string
	editorClassName?: string
	onUpdate?: (content: Content) => void
	onBlur?: (content: Content) => void
	onNewBlock?: (content: Content) => void
	value?: Content
	throttleDelay?: number
}

export interface LAEditorRef {
	focus: () => void
}

interface CustomEditor extends Editor {
	previousBlockCount?: number
}

export const LAEditor = React.forwardRef<LAEditorRef, LAEditorProps>(
	(
		{
			initialContent,
			value,
			placeholder,
			output = "html",
			editorClassName,
			className,
			onUpdate,
			onBlur,
			onNewBlock,
			throttleDelay = 1000,
			...props
		},
		ref
	) => {
		const [content, setContent] = React.useState<Content | undefined>(value)
		const throttledContent = useThrottleFn(defaultContent => defaultContent, throttleDelay, [content])
		const [lastThrottledContent, setLastThrottledContent] = React.useState(throttledContent)

		const handleUpdate = React.useCallback(
			(editor: Editor) => {
				const newContent = getOutput(editor, output)
				setContent(newContent)

				const customEditor = editor as CustomEditor
				const json = customEditor.getJSON()

				if (json.content && Array.isArray(json.content)) {
					const currentBlockCount = json.content.length

					if (
						typeof customEditor.previousBlockCount === "number" &&
						currentBlockCount > customEditor.previousBlockCount
					) {
						requestAnimationFrame(() => {
							onNewBlock?.(newContent)
						})
					}

					customEditor.previousBlockCount = currentBlockCount
				}
			},
			[output, onNewBlock]
		)

		const editor = useEditor({
			autofocus: false,
			extensions: createExtensions({ placeholder }),
			editorProps: {
				attributes: {
					autocomplete: "off",
					autocorrect: "off",
					autocapitalize: "off",
					class: editorClassName || ""
				}
			},
			onCreate: ({ editor }) => {
				if (editor.isEmpty && value) {
					editor.commands.setContent(value)
				}
			},
			onUpdate: ({ editor }) => handleUpdate(editor),
			onBlur: ({ editor }) => {
				requestAnimationFrame(() => {
					onBlur?.(getOutput(editor, output))
				})
			}
		})

		React.useEffect(() => {
			if (editor && initialContent) {
				// https://github.com/ueberdosis/tiptap/issues/3764
				setTimeout(() => {
					editor.commands.setContent(initialContent)
				})
			}
		}, [editor, initialContent])

		React.useEffect(() => {
			if (lastThrottledContent !== throttledContent) {
				setLastThrottledContent(throttledContent)

				requestAnimationFrame(() => {
					onUpdate?.(throttledContent!)
				})
			}
		}, [throttledContent, lastThrottledContent, onUpdate])

		React.useImperativeHandle(
			ref,
			() => ({
				focus: () => editor?.commands.focus()
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
