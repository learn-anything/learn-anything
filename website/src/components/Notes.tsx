import { Note } from "grafbase/db/topic"
import { For } from "solid-js"

interface Props {
  notes: Note[]
}

export default function Notes(props: Props) {
  return (
    <div>
      <For each={props.notes}>{(note) => <div>{note.content}</div>}</For>
    </div>
  )
}
