"use client"

import { useAccount } from "@/lib/providers/jazz-provider"
import { Task } from "@/lib/schema/tasks"
import { TaskList } from "./TaskList"
import { TaskForm } from "./TaskForm"
import { LaIcon } from "@/components/custom/la-icon"

export const TaskRoute: React.FC = () => {
	const { me } = useAccount({ root: { tasks: [] } })
	const tasks = me?.root.tasks
	console.log(tasks, "tasks here")

	const updateTask = (taskId: string, updates: Partial<Task>) => {
		if (me?.root?.tasks) {
			const taskIndex = me.root.tasks.findIndex(task => task?.id === taskId)
			if (taskIndex !== -1) {
				Object.assign(me.root.tasks[taskIndex]!, updates)
			}
		}
	}

	return (
		<div className="flex flex-col space-y-4 p-4">
			<div className="flex flex-row items-center gap-1">
				<LaIcon name="ListTodo" className="size-6" />
				<h1 className="text-xl font-bold">Current Tasks</h1>
			</div>
			<TaskForm />
			<TaskList tasks={tasks} onUpdateTask={updateTask} />
		</div>
	)
}
