import { Task } from "@/lib/schema/tasks"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"

interface TaskItemProps {
	task: Task
	onUpdateTask: (taskId: string, updates: Partial<Task>) => void
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdateTask }) => {
	const statusChange = (checked: boolean) => {
		onUpdateTask(task.id, { status: checked ? "done" : "todo" })
	}

	const formattedDate = format(new Date(task.createdAt), "EEE, MMMM do, yyyy")

	return (
		<li className="bg-result transitiion-opacity flex items-center justify-between rounded-lg p-2 px-3 hover:opacity-60">
			<div className="flex flex-row items-center gap-3">
				<Checkbox checked={task.status === "done"} onCheckedChange={statusChange} />
				<p className={task.status === "done" ? "text-foreground line-through" : ""}>{task.title}</p>
			</div>
			<span className="text-muted-foreground text-xs">{formattedDate}</span>
		</li>
	)
}
