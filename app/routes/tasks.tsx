import { createFileRoute } from "@tanstack/react-router"

function RouteComponent() {
  return (
    <div>
      <h1>Tasks</h1>
    </div>
  )
}
export const Route = createFileRoute("/tasks")({
  component: RouteComponent,
})
