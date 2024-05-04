import { For, Show, createSignal } from "solid-js"

import { Motion, Presence } from "solid-motionone"
import { createEditor, EditorContent } from "tiptap-solid"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Button from "../../components/Button"
import { Sidebar } from "../../components/Sidebar"

export default function Topic() {
	Placeholder.configure({
		emptyEditorClass: "my-custom-is-empty-class",
		placeholder: "write something...",
	})
	const textEditor = createEditor({
		extensions: [Placeholder, StarterKit],
		editorProps: {
			attributes: {
				class: "focus:outline-none p-4",
			},
		},
	})

	return (
		<div class="ml-[200px] p-3 h-screen">
			<Sidebar />
			<div class=" border border-[#191919] rounded-[7px] h-full">
				<EditorContent editor={textEditor()} />
			</div>
		</div>
	)
}
