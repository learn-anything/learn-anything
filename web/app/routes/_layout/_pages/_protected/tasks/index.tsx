import { createFileRoute, Link } from "@tanstack/react-router"
import { useAccount } from "@/lib/providers/jazz-provider"
import { LaIcon } from "@/components/custom/la-icon"
import { isToday, isFuture } from "date-fns"
import { ID } from "jazz-tools"
import { useTaskActions } from "~/hooks/actions/use-task-actions"
import { TaskForm } from "./-form"
import { TaskList } from "./-list"
import { Task } from "~/lib/schema/task"
import { z } from "zod"
import { cn } from "~/lib/utils"
// import { getFeatureFlag } from "~/actions"

const taskSearchSchema = z.object({
  filter: z.enum(["today", "upcoming"]).optional(),
})

const TaskTabs: React.FC<{ filter?: string }> = ({ filter }) => {
  return (
    <div className="mb-4 flex items-center justify-center gap-2">
      <Link
        to="/tasks"
        className={cn(
          "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
          filter === undefined
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:bg-accent/50",
        )}
      >
        <LaIcon name="ListTodo" className="size-4" />
        All Tasks
      </Link>
      <Link
        to="/tasks"
        search={{ filter: "today" }}
        className={cn(
          "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
          filter === "today"
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:bg-accent/50",
        )}
      >
        <LaIcon name="BookOpenCheck" className="size-4" />
        Today
      </Link>

      <Link
        to="/tasks"
        search={{ filter: "upcoming" }}
        className={cn(
          "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
          filter === "upcoming"
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:bg-accent/50",
        )}
      >
        <LaIcon name="History" className="size-4" />
        Upcoming
      </Link>
    </div>
  )
}

export const Route = createFileRoute("/_layout/_pages/_protected/tasks/")({
  // beforeLoad: async ({ context }) => {
  //   if (!context.user.id) {
  //     throw new Error("Unauthorized")
  //   }

  //   const flag = await getFeatureFlag({ data: "TASK" })
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
  const { me } = useAccount({ root: { tasks: [{}] } })
  const tasks = me?.root.tasks
  const { deleteTask } = useTaskActions()

  const filteredTasks = tasks?.filter((task: Task) => {
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
      const taskIndex = me.root.tasks.findIndex(
        (task: Task) => task?.id === taskId,
      )
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
      <TaskTabs filter={filter} />
      {/* <div className="flex flex-row items-center gap-1">
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
      </div> */}
      <TaskForm />
      <TaskList
        tasks={filteredTasks?.filter((task: Task) => task !== null) || []}
        onUpdateTask={updateTask}
        onDeleteTask={onDeleteTask}
      />
    </div>
  )
}
