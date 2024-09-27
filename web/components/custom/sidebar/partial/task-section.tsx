import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ListOfTasks } from "@/lib/schema/tasks"
import { LaIcon } from "../../la-icon"
import { useEffect, useState } from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import { getFeatureFlag } from "@/app/actions"

export const TaskSection: React.FC<{ pathname: string }> = ({ pathname }) => {
	const me = { root: { tasks: [{ id: "1", title: "Test Task" }] } }

	const taskCount = me?.root.tasks?.length || 0
	const isActive = pathname === "/tasks"

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
			<TaskSectionHeader taskCount={taskCount} isActive={isActive} />
			{isFetching ? (
				<div className="py-2 text-center text-gray-500">Fetching tasks...</div>
			) : (
				<List tasks={me.root.tasks as ListOfTasks} />
			)}
		</div>
	)
}

interface TaskSectionHeaderProps {
	taskCount: number
	isActive: boolean
}

const TaskSectionHeader: React.FC<TaskSectionHeaderProps> = ({ taskCount, isActive }) => (
	<div
		className={cn(
			"flex min-h-[30px] items-center gap-px rounded-md",
			isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
		)}
	>
		<Link
			href="/tasks"
			className="flex flex-1 items-center justify-start rounded-md px-2 py-1 focus-visible:outline-none focus-visible:ring-0"
		>
			<p className="text-xs">
				Tasks
				{taskCount > 0 && <span className="text-muted-foreground ml-1">{taskCount}</span>}
			</p>
		</Link>
	</div>
	// <div
	// 	className={cn(
	// 		"flex min-h-[30px] items-center gap-px rounded-md",
	// 		isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
	// 	)}
	// >
	// 	<Button
	// 		variant="ghost"
	// 		className="size-6 flex-1 items-center justify-start rounded-md px-2 py-1 focus-visible:outline-none focus-visible:ring-0"
	// 	>
	// 		<p className="flex items-center text-xs font-medium">
	// 			Tasks
	// 			{taskCount > 0 && <span className="text-muted-foreground ml-1">{taskCount}</span>}
	// 		</p>
	// 	</Button>
	// </div>
)

interface ListProps {
	tasks: ListOfTasks
}

const List: React.FC<ListProps> = ({ tasks }) => {
	const pathname = usePathname()

	return (
		<div className="flex flex-col gap-px">
			<ListItem label="All Tasks" href="/tasks" count={tasks.length} isActive={pathname === "/tasks"} />
		</div>
	)
}

interface ListItemProps {
	label: string
	href: string
	count: number
	isActive: boolean
}

const ListItem: React.FC<ListItemProps> = ({ label, href, count, isActive }) => (
	<div className="group/reorder-task relative">
		<div className="group/task-link relative flex min-w-0 flex-1">
			<Link
				// TODO: update links
				href="/tasks"
				className="relative flex h-8 w-full items-center gap-2 rounded-md p-1.5 font-medium"
				// className={cn(
				// 	"relative flex h-8 w-full items-center gap-2 rounded-md p-1.5 font-medium",
				// 	isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
				// )}
			>
				<div className="flex max-w-full flex-1 items-center gap-1.5 truncate text-sm">
					<LaIcon name="BookCheck" className="opacity-60" />
					<p className={cn("truncate opacity-95 group-hover/task-link:opacity-100")}>{label}</p>
				</div>
			</Link>
			{count > 0 && (
				<span className="absolute right-2 top-1/2 z-[1] -translate-y-1/2 rounded p-1 text-sm">{count}</span>
			)}
		</div>
	</div>
)
