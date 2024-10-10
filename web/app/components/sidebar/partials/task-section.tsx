import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { isToday, isFuture } from "date-fns"
import { useAccount } from "@/lib/providers/jazz-provider"
import { useAuth, useUser } from "@clerk/tanstack-start"
import { getFeatureFlag } from "~/actions"
import { LaIcon } from "~/components/custom/la-icon"
import { Link } from "@tanstack/react-router"

export const TaskSection: React.FC = () => {
  const { me } = useAccount({ root: { tasks: [] } })

  const taskCount = me?.root?.tasks?.length || 0
  const todayTasks =
    me?.root?.tasks?.filter(
      (task) =>
        task?.status !== "done" && task?.dueDate && isToday(task.dueDate),
    ) || []
  const upcomingTasks =
    me?.root?.tasks?.filter(
      (task) =>
        task?.status !== "done" && task?.dueDate && isFuture(task.dueDate),
    ) || []

  const [, setIsFetching] = useState(false)
  const [isFeatureActive, setIsFeatureActive] = useState(false)
  const { isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()

  useEffect(() => {
    async function checkFeatureFlag() {
      setIsFetching(true)

      if (isLoaded && isSignedIn) {
        const response = await getFeatureFlag({ name: "TASK" })

        if (
          user?.emailAddresses.some((email) =>
            response?.emails.includes(email.emailAddress),
          )
        ) {
          setIsFeatureActive(true)
        }
        setIsFetching(false)
      }
    }

    checkFeatureFlag()
  }, [isLoaded, isSignedIn, user])

  if (!isLoaded || !isSignedIn) {
    return <div className="py-2 text-center text-gray-500">Loading...</div>
  }

  if (!me) return null

  if (!isFeatureActive) {
    return null
  }

  return (
    <div className="group/tasks flex flex-col gap-px py-2">
      <TaskSectionHeader title="Tasks" count={taskCount} />
      <TaskSectionHeader
        title="Today"
        iconName="BookOpenCheck"
        filter="today"
        count={todayTasks.length}
      />
      <TaskSectionHeader
        title="Upcoming"
        iconName="History"
        filter="upcoming"
        count={upcomingTasks.length}
      />
    </div>
  )
}

interface TaskSectionHeaderProps {
  title: string
  filter?: "today" | "upcoming"
  count: number
  iconName?: "BookOpenCheck" | "History"
}

const TaskSectionHeader: React.FC<TaskSectionHeaderProps> = ({
  title,
  filter,
  count,
  iconName,
}) => (
  <Link
    to="/tasks"
    className={cn(
      "flex min-h-[30px] flex-1 items-center justify-start gap-px rounded-md px-2 py-1 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-0",
    )}
    search={{ filter }}
    activeProps={{
      className: "bg-accent text-accent-foreground",
    }}
  >
    {iconName && <LaIcon className="size-13 shrink-0 pr-2" name={iconName} />}

    <p className="text-sm">
      {title}
      {count > 0 && <span className="ml-1 text-muted-foreground">{count}</span>}
    </p>
  </Link>
)
