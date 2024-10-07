import { createFileRoute } from "@tanstack/react-router"
import { useAccount } from "@/lib/providers/jazz-provider"
import { LaIcon } from "@/components/custom/la-icon"
import { isToday, isFuture } from "date-fns"
import { ID } from "jazz-tools"
import { useTaskActions } from "~/hooks/actions/use-task-actions"
import { TaskForm } from "./-form"
import { TaskList } from "./-list"
import { Task } from "~/lib/schema/task"
import { z } from "zod"
// import { getFeatureFlag } from "~/actions"

const taskSearchSchema = z.object({
  filter: z.enum(["today", "upcoming"]).optional(),
})

export const Route = createFileRoute("/_layout/_pages/_protected/tasks/")({
  // beforeLoad: async ({ context }) => {
  //   if (!context.user.id) {
  //     throw new Error("Unauthorized")
  //   }

  //   const flag = await getFeatureFlag({ name: "TASK" })
  //   const canAccess = context.user?.emailAddresses.some((email) =>
  //     flag?.emails.includes(email.emailAddress),
  //   )

  //   if (!canAccess) {
  //     throw new Error("Unauthorized")
  //   }
  // },
  validateSearch: taskSearchSchema,
  component: () => <TaskComponent />,
})

function TaskComponent() {
  const { filter } = Route.useSearch()
  const { me } = useAccount({ root: { tasks: [] } })
  const tasks = me?.root.tasks
  const { deleteTask } = useTaskActions()

  const filteredTasks = tasks?.filter((task) => {
    if (!task) return false
    if (filter === "today") {
      return task.status !== "done" && task.dueDate && isToday(task.dueDate)
    } else if (filter === "upcoming") {
      return task.status !== "done" && task.dueDate && isFuture(task.dueDate)
    }
    return true
  })

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    if (me?.root?.tasks) {
      const taskIndex = me.root.tasks.findIndex((task) => task?.id === taskId)
      if (taskIndex !== -1) {
        Object.assign(me.root.tasks[taskIndex]!, updates)
      }
    }
  }

  const onDeleteTask = (taskId: string) => {
    if (me) {
      deleteTask(me, taskId as ID<Task>)
    }
  }

  return (
    <div className="flex flex-col space-y-4 p-4">
      <div className="flex flex-row items-center gap-1">
        <LaIcon
          name={
            filter === "today"
              ? "BookOpenCheck"
              : filter === "upcoming"
                ? "History"
                : "ListTodo"
          }
          className="size-6"
        />
        <h1 className="text-xl font-bold">
          {filter === "today"
            ? "Today's Tasks"
            : filter === "upcoming"
              ? "Upcoming Tasks"
              : "All Tasks"}
        </h1>
      </div>
      <TaskForm />
      <TaskList
        tasks={
          filteredTasks?.filter((task): task is Task => task !== null) || []
        }
        onUpdateTask={updateTask}
        onDeleteTask={onDeleteTask}
      />
    </div>
  )
}
