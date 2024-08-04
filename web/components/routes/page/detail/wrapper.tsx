"use client"

import { LAEditor } from "@/components/la-editor"

export function DetailPageWrapper() {
  return (
    <div className="flex h-full flex-auto flex-col overflow-hidden">
      <div className="flex h-full w-full">
        <LAEditor />
      </div>
    </div>
  )
}
