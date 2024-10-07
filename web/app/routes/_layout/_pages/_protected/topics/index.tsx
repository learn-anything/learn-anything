import { createFileRoute } from "@tanstack/react-router"
import { TopicHeader } from "./-header"
import { TopicList } from "./-list"

export const Route = createFileRoute("/_layout/_pages/_protected/topics/")({
  component: () => <TopicComponent />,
})

function TopicComponent() {
  return (
    <div className="flex h-full flex-auto flex-col overflow-hidden">
      <TopicHeader />
      <TopicList />
    </div>
  )
}
