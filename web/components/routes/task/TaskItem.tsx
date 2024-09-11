import React from "react"
import { Task } from "@/lib/schema/tasks"
import { Checkbox } from "@/components/ui/checkbox"

interface TaskItemProps {
	task: Task
	onUpdateTask: (taskId: string, updates: Partial<Task>) => void
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdateTask }) => {
	const statusChange = (checked: boolean) => {
		onUpdateTask(task.id, { status: checked ? "done" : "todo" })
	}

	return (
		<li className="flex items-center space-x-2">
			<Checkbox checked={task.status === "done"} onCheckedChange={statusChange} />
			<span className={task.status === "done" ? "text-foreground line-through" : ""}>{task.title}</span>
		</li>
	)
}
