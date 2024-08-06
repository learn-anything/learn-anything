import { Sidebar } from "@/components/custom/sidebar/sidebar"

export default function TopicsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full min-h-full w-full flex-row items-stretch overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="relative flex flex-auto flex-col place-items-stretch overflow-auto rounded-md border bg-card lg:my-2 lg:mr-2">
          {children}
        </main>
      </div>
    </div>
  )
}
