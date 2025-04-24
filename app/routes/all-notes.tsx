import { createFileRoute } from "@tanstack/react-router"

function RouteComponent() {
  return (
    <div>
      <h1>All Notes</h1>
    </div>
  )
}

export const Route = createFileRoute("/all-notes")({
  component: RouteComponent,
})
