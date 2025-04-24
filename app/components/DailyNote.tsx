import { format } from "date-fns"

interface DailyNoteProps {
  date: Date
}

export default function DailyNote({ date }: DailyNoteProps) {
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()

    const text = e.clipboardData.getData("text/plain")

    document.execCommand("insertText", false, text)
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-3xl font-medium text-white">
          {format(date, "EEE, do MMMM, yyyy")}
        </h1>
      </div>

      <div
        contentEditable
        onPaste={handlePaste}
        className="flex-1 outline-none text-white/90 text-lg"
        style={{
          minHeight: "calc(100vh - 120px)",
          caretColor: "white",
        }}
      />
    </div>
  )
}
