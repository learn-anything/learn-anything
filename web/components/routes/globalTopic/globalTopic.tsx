"use client"

import { ContentHeader } from "@/components/custom/content-header"

export default function GlobalTopic({ topic }: { topic: string }) {
  return (
    <div className="flex h-full flex-auto flex-col overflow-hidden">
      <ContentHeader title={`${topic}`} />
      <div className="flex-1 overflow-auto p-4"></div>
    </div>
  )
}
