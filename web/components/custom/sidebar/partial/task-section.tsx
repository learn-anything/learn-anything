import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ListOfTasks, Task } from "@/lib/schema/tasks"
import { LaIcon } from "../../la-icon"
import { useEffect, useState } from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import { getFeatureFlag } from "@/app/actions"
import { isToday, isFuture } from "date-fns"
import { useAccount } from "@/lib/providers/jazz-provider"

export const TaskSection: React.FC<{ pathname: string }> = ({ pathname }) => {
	const { me } = useAccount({ root: { tasks: [] } })

	const taskCount = me?.root?.tasks?.length || 0
	const todayTasks =
		me?.root?.tasks?.filter(task => task?.status !== "done" && task?.dueDate && isToday(task.dueDate)) || []
	const upcomingTasks =
		me?.root?.tasks?.filter(task => task?.status !== "done" && task?.dueDate && isFuture(task.dueDate)) || []

	const [isFetching, setIsFetching] = useState(false)
	const [isFeatureActive, setIsFeatureActive] = useState(false)
	const { isLoaded, isSignedIn } = useAuth()
	const { user } = useUser()

	useEffect(() => {
		async function checkFeatureFlag() {
			setIsFetching(true)

			if (isLoaded && isSignedIn) {
				const [data, err] = await getFeatureFlag({ name: "TASK" })

				if (err) {
					console.error(err)
					setIsFetching(false)
					return
				}

				if (user?.emailAddresses.some(email => data.flag?.emails.includes(email.emailAddress))) {
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
			<TaskSectionHeader title="Tasks" href="/tasks" count={taskCount} isActive={pathname === "/tasks"} />
			<TaskSectionHeader
				title="Today"
				iconName="BookOpenCheck"
				href="/tasks/today"
				count={todayTasks.length}
				isActive={pathname === "/tasks/today"}
			/>
			<TaskSectionHeader
				title="Upcoming"
				iconName="History"
				href="/tasks/upcoming"
				count={upcomingTasks.length}
				isActive={pathname === "/tasks/upcoming"}
			/>
		</div>
	)
}

interface TaskSectionHeaderProps {
	title: string
	href: string
	count: number
	isActive: boolean
	iconName?: "BookOpenCheck" | "History"
}

const TaskSectionHeader: React.FC<TaskSectionHeaderProps> = ({ title, href, count, isActive, iconName }) => (
	<div
		className={cn(
			"flex min-h-[30px] items-center gap-px rounded-md",
			isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
		)}
	>
		<Link
			href={href}
			className="flex flex-1 items-center justify-start rounded-md px-2 py-1 focus-visible:outline-none focus-visible:ring-0"
		>
			{iconName && <LaIcon className="size-13 shrink-0 pr-2" name={iconName} />}

			<p className="text-sm">
				{title}
				{count > 0 && <span className="text-muted-foreground ml-1">{count}</span>}
			</p>
		</Link>
	</div>
)
