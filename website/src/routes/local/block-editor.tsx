import Placeholder from "@tiptap/extension-placeholder"
import StarterKit from "@tiptap/starter-kit"
import { EditorContent, SolidRenderer, createEditor } from "tiptap-solid"
import { Mention } from "@tiptap/extension-mention"
import tippy, { GetReferenceClientRect, Instance } from "tippy.js"
import { For, createEffect } from "solid-js"

const PlaceholderPlugin = Placeholder.configure({
	placeholder: "Write something",
})

const CustomStarterKit = StarterKit.configure({
	heading: {
		HTMLAttributes: {
			class: `text-[#333] font-bold`,
		},
	},
})

function MentionNode(props: { items: [] }) {
	createEffect(() => {
		console.log({ ...props }, "props")
	})
	return (
		<div>
			<For each={props.items}>{(item) => <div>{item}</div>}</For>
		</div>
	)
}

const CommandBlock = Mention.configure({
	suggestion: {
		char: "/",
		// can be async and fetch from server
		items: () => {
			return ["Heading", "Link", "Todo"]
		},
		render: () => {
			let solidRenderer: SolidRenderer<any>
			let popup: Instance<unknown>[]

			return {
				onStart: (p) => {
					solidRenderer = new SolidRenderer(MentionNode, {
						props: p,
						editor: p.editor,
					})
					popup = tippy("body", {
						getReferenceClientRect: p.clientRect as GetReferenceClientRect,
						appendTo: () => document.body,
						content: solidRenderer.element,
						showOnCreate: true,
						interactive: true,
						trigger: "manual",
						placement: "bottom-start",
					})
				},
				onExit() {
					popup[0]?.destroy
					solidRenderer.destroy()
				},
			}
		},
	},
})

export default function BlockEditor() {
	const editor = createEditor({
		extensions: [PlaceholderPlugin, CustomStarterKit, CommandBlock],
		editorProps: {
			attributes: {
				class: "focus:outline-none p-4",
			},
		},
	})

	createEffect(() => {
		console.log(editor()?.getJSON(), "editor json")
	})

	return (
		<div class="ml-[200px] p-3 h-screen">
			<div class=" border border-[#191919] rounded-[7px] h-full">
				<EditorContent editor={editor()} />
			</div>
		</div>
	)
}
