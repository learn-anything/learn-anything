import { createFileRoute } from "@tanstack/react-router"

function RouteComponent() {
  return (
    <div>
      <h1>Daily Notes</h1>
    </div>
  )
}

export const Route = createFileRoute("/daily")({
  component: RouteComponent,
})
