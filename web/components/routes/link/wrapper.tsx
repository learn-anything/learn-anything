"use client"

import { LinkHeader } from "@/components/routes/link/header"
import { LinkList } from "@/components/routes/link/list"
import { LinkManage } from "@/components/routes/link/form/manage"
import { useAtom } from "jotai"
import { linkEditIdAtom } from "@/store/link"

export function LinkWrapper() {
  const [editId] = useAtom(linkEditIdAtom)

  return (
    <div className="flex h-full flex-auto flex-col overflow-hidden">
      <LinkHeader />
      <LinkManage />
      <LinkList key={editId} />
    </div>
  )
}
