import { useState, useEffect } from "react"
import { cn } from "~/lib/utils"
import ResizablePanel from "./ResizablePanel"
import { Link } from "@tanstack/react-router"
import { format } from "date-fns"

type SidebarProps = {
  className?: string
  width?: number
  onWidthChange?: (width: number) => void
}

export default function Sidebar({
  className,
  width = 250,
  onWidthChange,
}: SidebarProps) {
  const today = new Date()
  const formattedDate = format(today, "ddMMyyyy")

  return (
    <ResizablePanel
      width={width}
      onWidthChange={onWidthChange}
      className={cn(
        "text-sidebar-foreground border-r bg-sidebar border-white/10 h-full overflow-y-auto flex flex-col",
        className,
      )}
    >
      <div className="p-4 flex-1 overflow-auto">
        <nav className="space-y-2">
          <Link
            to="/daily/$date"
            params={{ date: formattedDate }}
            className="flex items-center text-white gap-2 px-3 py-2 rounded-lg hover:bg-white/2 transition-colors"
            inactiveProps={{ className: "text-white/60" }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Daily notes
          </Link>

          <Link
            to="/all-notes"
            className="flex items-center text-white gap-2 px-3 py-2 rounded-lg hover:bg-white/2 transition-colors"
            inactiveProps={{ className: "text-white/60" }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            All notes
          </Link>

          <Link
            to="/tasks"
            className="flex items-center text-white gap-2 px-3 py-2 rounded-lg hover:bg-white/2 transition-colors"
            inactiveProps={{ className: "text-white/60" }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            Tasks
          </Link>
        </nav>
      </div>
    </ResizablePanel>
  )
}
