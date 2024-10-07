import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { JournalEntry, JournalEntryLists } from "@/lib/schema/journal"
import { useAccount } from "@/lib/providers/jazz-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { calendarFormatDate } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
// import { getFeatureFlag } from "~/actions"

export const Route = createFileRoute("/_layout/_pages/_protected/journals/")({
  // beforeLoad: async ({ context }) => {
  //   if (!context.user.id) {
  //     throw new Error("Unauthorized")
  //   }

  //   const flag = await getFeatureFlag({ name: "JOURNAL" })
  //   const canAccess = context.user?.emailAddresses.some((email) =>
  //     flag?.emails.includes(email.emailAddress),
  //   )
  //   if (!canAccess) {
  //     throw new Error("Unauthorized")
  //   }
  // },
  component: () => <JournalComponent />,
})

function JournalComponent() {
  const [date, setDate] = useState<Date>(new Date())
  const { me } = useAccount({ root: { journalEntries: [] } })
  const [newNote, setNewNote] = useState<JournalEntry | null>(null)

  const notes =
    me?.root?.journalEntries ||
    (me ? JournalEntryLists.create([], { owner: me }) : [])

  const selectDate = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate)
    }
  }

  const createNewNote = () => {
    if (me) {
      const newEntry = JournalEntry.create(
        {
          title: "",
          content: "",
          date: date,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { owner: me._owner },
      )
      setNewNote(newEntry)
    }
  }

  const handleNewNoteChange = (field: keyof JournalEntry, value: string) => {
    if (newNote) {
      setNewNote((prevNote) => {
        if (prevNote) {
          return JournalEntry.create(
            { ...prevNote, [field]: value },
            { owner: me!._owner },
          )
        }
        return prevNote
      })
    }
  }

  const saveNewNote = () => {
    if (newNote && me?.root?.journalEntries) {
      me.root.journalEntries.push(newNote)
      setNewNote(null)
    }
  }

  return (
    <div className="flex h-full flex-auto flex-col">
      <div className="relative flex flex-1 overflow-hidden">
        <div className="flex-grow overflow-y-auto p-6">
          {newNote ? (
            <div className="mb-6 rounded-lg border p-4 shadow-sm">
              <Input
                type="text"
                placeholder="Title"
                value={newNote.title}
                onChange={(e) => handleNewNoteChange("title", e.target.value)}
                className="mb-2 w-full text-xl font-semibold"
              />
              <Textarea
                placeholder="Content"
                value={newNote.content as string}
                onChange={(e) => handleNewNoteChange("content", e.target.value)}
                className="w-full"
              />
              <Button onClick={saveNewNote} className="mt-2">
                Save Note
              </Button>
            </div>
          ) : null}
          {notes.map((entry, index) => (
            <div key={index} className="mb-6 rounded-lg border p-4 shadow-sm">
              <h2 className="mb-2 text-xl font-semibold">{entry?.title}</h2>
              <div className="prose prose-sm max-w-none">
                {entry?.content &&
                  (typeof entry.content === "string" ? (
                    <div dangerouslySetInnerHTML={{ __html: entry.content }} />
                  ) : (
                    <pre>{JSON.stringify(entry.content, null, 2)}</pre>
                  ))}
              </div>
              <p className="mt-2 text-sm opacity-70">
                {entry?.date && calendarFormatDate(new Date(entry.date))}
              </p>
            </div>
          ))}
        </div>
        <div className="w-[22%] border-l p-2">
          <Calendar
            mode="single"
            selected={date}
            onSelect={selectDate}
            className="rounded-md border"
          />
          <Button onClick={createNewNote} className="mt-4 w-full">
            New Note
          </Button>
          <div className="p-2 text-sm opacity-50">
            <p>Total notes: {notes.length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
