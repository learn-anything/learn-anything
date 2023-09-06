import { createTiptapEditor } from "solid-tiptap"
import StarterKit from "@tiptap/starter-kit"
import { Vimirror } from "./vimirror"
import { createSignal } from "solid-js"

export default function TiptapEditor() {
  let ref!: HTMLDivElement

  const [currentVimMode, setCurrentVimMode] = createSignal("")

  // Vimirror.configure({ updateValue: ({ mode }) => currentVimMode.value = mode })

  const editor = createTiptapEditor(() => ({
    element: ref!,
    extensions: [
      StarterKit,
      Vimirror.configure({
        updateValue: ({ mode }) => setCurrentVimMode(mode),
      }),
    ],
    autofocus: true,
    content: `<p>Example Text</p>`,
  }))

  return (
    <>
      {/* <style>
        {`
.tiptap-container {
  margin: 1em 0 0 0;
}
.tiptap-container .editor-content .ProseMirror {
  outline: none;
  font-size: 20px;
  caret-color: transparent;
}
.tiptap-container .editor-content .ProseMirror[show-cursor="true"] {
  caret-color: black;
}
.tiptap-container .editor-content .ProseMirror[mode="normal"] .vim-cursor {
  background: white;
  color: black;
}
.tiptap-container .editor-content .ProseMirror[mode="insert"] .vim-cursor::before {
  content: " ";
  position: absolute;
  width: 2px;
  background: white;
  animation: blink 1s step-start 0s infinite;
}
        `}
      </style> */}
      <div
        class="h-full w-full min-h-0 min-w-0 flex-1 pr-10 pt-10 pl-10 tiptap-container"
        id="editor"
        ref={ref}
      />
    </>
  )
}
