import Placeholder from "@tiptap/extension-placeholder"
import StarterKit from "@tiptap/starter-kit"
import { EditorContent, createEditor } from "tiptap-solid"

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

// TODO: simple text editor
export default function Editor() {
	const textEditor = createEditor({
		extensions: [PlaceholderPlugin, CustomStarterKit],
		editorProps: {
			attributes: {
				class: "focus:outline-none p-4",
			},
		},
	})

	return (
		<div class="ml-[200px] p-3 h-screen">
			<div class=" border border-[#191919] rounded-[7px] h-full">
				<EditorContent editor={textEditor()} />
			</div>
		</div>
	)
}
