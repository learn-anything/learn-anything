import { createFileRoute } from "@tanstack/react-router"

function RouteComponent() {
  return (
    <div className="flex flex-col w-full h-full p-6">
      <h1>Tasks</h1>
    </div>
  )
}
export const Route = createFileRoute("/tasks")({
  component: RouteComponent,
})
