import { createFileRoute } from "@tanstack/react-router"
import { parse, format } from "date-fns"
import DailyCalendar from "~/components/DailyCalendar"
import Tiptap from "~/components/Tiptap"

function RouteComponent() {
  const { date } = Route.useParams()
  const parsedDate = parse(date, "ddMMyyyy", new Date())

  return (
    <div className="flex h-screen">
      <div className="flex-1 px-6 py-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-medium text-white mb-6">
            {format(parsedDate, "EEE, do MMMM, yyyy")}
          </h1>
          <Tiptap />
        </div>
      </div>
      <div className="w-[250px] h-full">
        <DailyCalendar selectedDate={parsedDate} />
      </div>
    </div>
  )
}

export const Route = createFileRoute("/daily/$date")({
  component: RouteComponent,
})
