import { createFileRoute } from "@tanstack/react-router"
import { PageHeader } from "./-header"
import { PageList } from "./-list"

export const Route = createFileRoute("/_layout/_pages/_protected/pages/")({
  component: () => <PageComponent />,
})

export function PageComponent() {
  return (
    <div className="flex h-full flex-auto flex-col overflow-hidden">
      <PageHeader />
      <PageList />
    </div>
  )
}
