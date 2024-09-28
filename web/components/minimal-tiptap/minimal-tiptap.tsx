import * as React from "react"
import "./styles/index.css"

import { EditorContent } from "@tiptap/react"
import type { Content, Editor } from "@tiptap/react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { SectionOne } from "./components/section/one"
import { SectionTwo } from "./components/section/two"
import { SectionThree } from "./components/section/three"
import { SectionFour } from "./components/section/four"
import { SectionFive } from "./components/section/five"
import { LinkBubbleMenu } from "./components/bubble-menu/link-bubble-menu"
import { ImageBubbleMenu } from "./components/bubble-menu/image-bubble-menu"
import type { UseMinimalTiptapEditorProps } from "./hooks/use-minimal-tiptap"
import { useMinimalTiptapEditor } from "./hooks/use-minimal-tiptap"

export interface MinimalTiptapProps extends Omit<UseMinimalTiptapEditorProps, "onUpdate"> {
	value?: Content
	onChange?: (value: Content) => void
	className?: string
	editorContentClassName?: string
}

const Toolbar = ({ editor }: { editor: Editor }) => (
	<div className="border-border shrink-0 overflow-x-auto border-b p-2">
		<div className="flex w-max items-center gap-px">
			<SectionOne editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} />

			<Separator orientation="vertical" className="mx-2 h-7" />

			<SectionTwo
				editor={editor}
				activeActions={["bold", "italic", "strikethrough", "code", "clearFormatting"]}
				mainActionCount={2}
			/>

			<Separator orientation="vertical" className="mx-2 h-7" />

			<SectionThree editor={editor} />

			<Separator orientation="vertical" className="mx-2 h-7" />

			<SectionFour editor={editor} activeActions={["orderedList", "bulletList"]} mainActionCount={0} />

			<Separator orientation="vertical" className="mx-2 h-7" />

			<SectionFive editor={editor} activeActions={["codeBlock", "blockquote", "horizontalRule"]} mainActionCount={0} />
		</div>
	</div>
)

export type MinimalTiptapEditorRef = {
	editor: Editor | null
}

export const MinimalTiptapEditor = React.forwardRef<MinimalTiptapEditorRef, MinimalTiptapProps>(
	({ value, onChange, className, editorContentClassName, ...props }, ref) => {
		const editor = useMinimalTiptapEditor({
			value,
			onUpdate: onChange,
			...props
		})

		React.useImperativeHandle(
			ref,
			() => ({
				editor: editor || null
			}),
			[editor]
		)

		if (!editor) {
			return null
		}

		return (
			<div
				className={cn(
					"border-input focus-within:border-primary flex h-auto min-h-72 w-full flex-col rounded-md border shadow-sm",
					className
				)}
			>
				<Toolbar editor={editor} />
				<EditorContent editor={editor} className={cn("minimal-tiptap-editor", editorContentClassName)} />
				<LinkBubbleMenu editor={editor} />
				<ImageBubbleMenu editor={editor} />
			</div>
		)
	}
)

MinimalTiptapEditor.displayName = "MinimalTiptapEditor"

export default MinimalTiptapEditor
