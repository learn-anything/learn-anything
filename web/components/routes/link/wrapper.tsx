"use client"

import { useCallback } from "react"
import { LinkHeader } from "@/components/routes/link/header"
import { LinkList } from "@/components/routes/link/list"
import { LinkManage } from "@/components/routes/link/form/manage"
import { useAtom } from "jotai"
import { linkEditIdAtom } from "@/store/link"

export function LinkWrapper() {
  const [editId, setEditId] = useAtom(linkEditIdAtom)

  const overlayClick = useCallback(() => {
    setEditId(null)
  }, [setEditId])

  return (
    <div className="flex h-full flex-auto flex-col overflow-hidden">
      <LinkHeader />
      <LinkManage />
      <LinkList key={editId} />
      {editId && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={overlayClick}
        />
      )}
    </div>
  )
}
