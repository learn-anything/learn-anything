import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from "date-fns"
import { Link } from "@tanstack/react-router"

interface DailyCalendarProps {
  selectedDate: Date
}

export default function DailyCalendar({ selectedDate }: DailyCalendarProps) {
  const monthStart = startOfMonth(selectedDate)
  const monthEnd = endOfMonth(selectedDate)

  const days = eachDayOfInterval({
    start: monthStart,
    end: monthEnd,
  })

  return (
    <div className="h-full bg-sidebar p-6 border-l border-white/10">
      <div className="text-center mb-6">
        <h2 className="text-lg font-medium text-white">
          {format(selectedDate, "MMMM yyyy")}
        </h2>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
          <div key={day} className="text-center text-sm text-gray-400 py-1">
            {day}
          </div>
        ))}

        {days.map((day) => {
          const formattedDate = format(day, "ddMMyyyy")
          const isSelected = isSameDay(day, selectedDate)
          const isToday = isSameDay(day, new Date())

          return (
            <Link
              key={formattedDate}
              to="/daily/$date"
              params={{ date: formattedDate }}
              className={`
                text-center p-2 rounded-lg transition-colors
                ${isSelected ? "bg-blue-500/50 text-white" : "text-white/80 hover:bg-white/10"}
                //  TODO: fix hover text effect
                ${isToday && !isSelected ? "text-blue-500" : ""}
              `}
            >
              {format(day, "d")}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
