import { useState, useEffect } from "react"

import { cn } from "@/lib/utils"
import { useLocation, useNavigate } from "@tanstack/react-router"

interface GuideCommunityToggleProps {
  topicName: string
}

export const GuideCommunityToggle: React.FC<GuideCommunityToggleProps> = ({
  topicName,
}) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [view, setView] = useState<"guide" | "community">("guide")

  useEffect(() => {
    setView(pathname.includes("/community/") ? "community" : "guide")
  }, [pathname])

  const handleToggle = (newView: "guide" | "community") => {
    setView(newView)
    if (newView === "community") {
      navigate({ to: "/community/$topicName", params: { topicName } })
    } else {
      navigate({ to: "/$", params: { _splat: topicName } })
    }
  }

  return (
    <div className="relative flex h-8 w-48 items-center rounded-md bg-accent/70">
      <div
        className="absolute h-8 w-[calc(50%-4px)] rounded-md transition-all duration-300 ease-in-out"
        style={{ left: view === "guide" ? "2px" : "calc(50% + 2px)" }}
      />
      <button
        className={cn(
          "relative z-10 h-full flex-1 rounded-md text-sm font-medium transition-colors",
          view === "guide" ? "bg-accent text-primary" : "text-primary/50",
        )}
        onClick={() => handleToggle("guide")}
      >
        Guide
      </button>
      <button
        className={cn(
          "relative z-10 h-full flex-1 rounded-md text-sm font-medium transition-colors",
          view === "community" ? "bg-accent text-primary" : "text-primary/50",
        )}
        onClick={() => handleToggle("community")}
      >
        Community
      </button>
    </div>
  )
}
