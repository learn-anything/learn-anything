import React from "react"
import { ListOfTasks, Task } from "@/lib/schema/tasks"
import { TaskItem } from "./TaskItem"

interface TaskListProps {
	tasks?: ListOfTasks
	onUpdateTask: (taskId: string, updates: Partial<Task>) => void
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdateTask }) => {
	return (
		<ul className="space-y-2">
			{tasks?.map(task => task?.id && <TaskItem key={task.id} task={task} onUpdateTask={onUpdateTask} />)}
		</ul>
	)
}
