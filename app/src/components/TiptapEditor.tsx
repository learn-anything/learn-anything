import { createTiptapEditor } from "solid-tiptap"
import StarterKit from "@tiptap/starter-kit"

export default function TiptapEditor() {
  let ref!: HTMLDivElement

  const editor = createTiptapEditor(() => ({
    element: ref!,
    extensions: [StarterKit],
    content: `<p>Example Text</p>`,
  }))

  return <div id="editor" ref={ref} />
}
