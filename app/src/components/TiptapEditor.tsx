import { createTiptapEditor } from "solid-tiptap"
import StarterKit from "@tiptap/starter-kit"

export default function TiptapEditor() {
  let ref!: HTMLDivElement

  const editor = createTiptapEditor(() => ({
    element: ref!,
    extensions: [StarterKit],
    content: `<p>Example Text</p>`,
  }))

  return (
    <div
      class="h-full w-full min-h-0 min-w-0 flex-1 pr-10 pt-10 pl-10"
      id="editor"
      ref={ref}
    />
  )
}
