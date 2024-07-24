import { LinkHeader } from "@/components/routes/link/header"
import { LinkList } from "@/components/routes/link/list"
import { LinkManage } from "@/components/routes/link/form/manage"

export function LinkWrapper() {
  return (
    <div className="flex h-full flex-auto flex-col overflow-hidden">
      <LinkHeader />
      <LinkManage />
      <LinkList />
    </div>
  )
}
