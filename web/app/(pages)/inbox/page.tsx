import { InboxContentHeader } from "@/components/routes/inbox/content-header"
import { InboxList } from "@/components/routes/inbox/list"
import { InboxManage } from "@/components/routes/inbox/manage"

export default function InboxPage() {
  return (
    <div className="flex h-full flex-auto flex-col overflow-hidden">
      <InboxContentHeader />
      <InboxManage />
      <InboxList />
    </div>
  )
}
