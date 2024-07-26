"use client"

import { ContentHeader } from "@/components/custom/content-header"
import { useSearchParams } from "next/navigation"

export default function GlobalTopic() {
  const searchParams = useSearchParams()
  const topic = searchParams.get("topic") || "Unknown Topic"

  return (
    <div className="flex h-full flex-auto flex-col overflow-hidden">
      <ContentHeader title={`${topic}`} />
      <div className="flex-1 overflow-auto p-4"></div>
    </div>
  )
}
